from rest_framework import serializers
from kordecms.models import Page, Article, ArticleComment, PageElement, ArticleElement
from django.contrib.auth.models import User


class PageElementSerializer(serializers.ModelSerializer):
    # Set the page to read only so we bypass the null check when updating a page and it elements
    image_url = serializers.ReadOnlyField()

    class Meta:
        model = PageElement


class PageSerializer(serializers.ModelSerializer):
    elements = PageElementSerializer(many=True)
    thumbnail_url = serializers.ReadOnlyField()

    class Meta:
        model = Page

    def create(self, validated_data):
        """
        Pops the element array and saves all of the elements individually.
        """
        elements_data = validated_data.pop('elements')
        print(elements_data)
        page = Page.objects.create(**validated_data)
        for element_data in elements_data:
            print(element_data)
            PageElement.objects.create(page=page, **element_data)
        return page


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == 'password':
                # checking if password is changed to avoid double hashing
                if instance.password != value:
                    instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance


class ArticleElementSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    image_url = serializers.ReadOnlyField()

    class Meta:
        model = ArticleElement
        fields = ('id', 'article', 'type', 'width_type', 'text', 'image_url')


class ArticleSerializer(serializers.ModelSerializer):
    # Creates a nested relationship with all its elements, the related name is set in ArticleElement
    elements = ArticleElementSerializer(many=True)
    thumbnail_image_url = serializers.ReadOnlyField()

    class Meta:
        model = Article
        fields = (
            'id', 'title', 'author_name', 'body_text', 'thumbnail_image_url', 'created_at', 'tag_string', 'author',
            'elements')

    def create(self, validated_data):
        """
        Pops the element array and saves all of the elements individually.
        """
        # Get the request object
        request = self.context.get("request")

        elements_data = validated_data.pop('elements')
        article = Article.objects.create(**validated_data)
        for element_data in elements_data:
            ArticleElement.objects.create(article=article, **element_data)
        return article

    def update(self, instance, validated_data):
        # Update the article instance
        instance.title = validated_data.get('title', instance.title)
        instance.body_text = validated_data.get('body_text', instance.body_text)
        instance.tag_string = validated_data.get('tag_string', instance.tag_string)
        instance.save()

        # Maps for id->instance id->data item.
        all_elements = instance.elements.all()
        element_mapping = {element.id: element for element in all_elements}
        # List all the data from elements.
        data_list = [item for item in validated_data['elements']]
        # List all the id's
        data_id_list = [item.get('id') for item in validated_data['elements']]

        # Update or create new elements
        for data in data_list:
            element = element_mapping.get(data.get('id'), None)
            if element is None:
                new = ArticleElement(
                    article=instance,
                    type=data.get('type'),
                    width_type=data.get('width_type'),
                    text=data.get('text'))
                new.save()
            else:
                ArticleElement.objects.update_or_create(id=data.get('id'), defaults=data)

        # Delete any elements not included in the request
        # Check for elements that are deleted
        for element in all_elements:
            if element.id not in data_id_list:
                element.delete()
        return instance


class ArticleCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleComment

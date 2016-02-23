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
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance


class ArticleElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleElement
        fields = ('id','type', 'width_type', 'text', 'image_src')


class ArticleSerializer(serializers.ModelSerializer):
    # Creates a nested relationship with all its elements, the related name is set in ArticleElement
    elements = ArticleElementSerializer(many=True)

    class Meta:
        model = Article
        fields = (
            'id', 'title', 'author_name', 'body_text', 'thumbnail_image_src', 'created_at', 'tag_string', 'author',
            'elements')

    def create(self, validated_data):
        """
        Pops the element array and saves all of the elements individually.
        """
        elements_data = validated_data.pop('elements')
        article = Article.objects.create(**validated_data)
        for element_data in elements_data:
            ArticleElement.objects.create(article=article, **element_data)
        return article

    # TODO this needs to be implemented for article update to work
    # def update(self, instance, validated_data):
    #
    #     # Update the book instance
    #     instance.title = validated_data['title']
    #     instance.save()
    #
    #     # Delete any pages not included in the request
    #     page_ids = [item['page_id'] for item in validated_data['pages']]
    #     for page in instance.books:
    #         if page.id not in page_ids:
    #             page.delete()
    #
    #     # Create or update page instances that are in the request
    #     for item in validated_data['pages']:
    #         page = Page(id=item['page_id'], text=item['text'], book=instance)
    #         page.save()
    #
    #     return instance


class ArticleCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleComment

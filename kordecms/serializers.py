from rest_framework import serializers
from kordecms.models import Page, Article, ArticleComment, PageElement, ArticleElement
from django.contrib.auth.models import User


class PageElementSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField()

    class Meta:
        model = PageElement


class PageSerializer(serializers.ModelSerializer):
    elements = PageElementSerializer(many=True, read_only=True)
    thumbnail_url = serializers.ReadOnlyField()

    class Meta:
        model = Page

    def create(self, validated_data):
        """
        Pops the element array and saves all of the elements individually.
        """
        elements_data = validated_data.pop('elements')
        page = Page.objects.create(**validated_data)
        for element_data in elements_data:
            PageElement.objects.create(page=page, **element_data)
        return page


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User


class ArticleElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleElement


class ArticleSerializer(serializers.ModelSerializer):
    # Creates a nested relationship with all its elements, the related name is set in ArticleElement
    # TODO expand this with create and update to become a nested post endpoint
    # http://www.django-rest-framework.org/api-guide/relations/
    elements = ArticleElementSerializer(many=True, read_only=True)

    class Meta:
        model = Article
        fields = ('id', 'author', 'elements')

    def create(self, validated_data):
        """
        Pops the element array and saves all of the elements individually.
        """
        elements_data = validated_data.pop('elements')
        article = Article.objects.create(**validated_data)
        for element_data in elements_data:
            ArticleElement.objects.create(article=article, **element_data)
        return article


class ArticleCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleComment

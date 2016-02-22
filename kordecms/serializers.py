from rest_framework import serializers
from kordecms.models import Page, Article, ArticleComment, PageElement, ArticleElement
from django.contrib.auth.models import User


class PageSerializer(serializers.ModelSerializer):
    thumbnail_url = serializers.ReadOnlyField()

    class Meta:
        model = Page


class PageElementSerializer(serializers.ModelSerializer):
    image_url = serializers.ReadOnlyField()

    class Meta:
        model = PageElement


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'is_superuser', 'is_staff', 'is_active', 'last_login')


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


class ArticleCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleComment



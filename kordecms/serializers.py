from rest_framework import serializers
from kordecms.models import Page, Article, ArticleComment, PageElement, ArticleImage
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
        fields = ('username', 'email')


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article


class ArticleCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleComment


class ArticleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleImage

from rest_framework import serializers
from kordecms.models import Article, ArticleComment, PageElement, ArticleImage
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'email')


class PageElementSerializer(serializers.ModelSerializer):
    class Meta:
        model = PageElement


class ArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article


class ArticleCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleComment

class ArticleImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ArticleImage

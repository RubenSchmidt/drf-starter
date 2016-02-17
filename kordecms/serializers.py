from rest_framework import serializers
from kordecms.models import Article, ArticleComment
from django.contrib.auth.models import User, Group


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

from django.contrib import admin
from kordecms.models import Article, ArticleComment


# Register your models here.

class ArticleCommentInline(admin.TabularInline):
    model = ArticleComment


class ArticleAdmin(admin.ModelAdmin):
    inlines = [
        ArticleCommentInline
    ]


admin.site.register(Article, ArticleAdmin)

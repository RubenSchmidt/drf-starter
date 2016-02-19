from django.contrib import admin
from kordecms.models import Article, ArticleComment, Page, PageElement, ArticleImage


# Register your models here.

class PageAdmin(admin.ModelAdmin):
    model = Page


class PageElementAdmin(admin.ModelAdmin):
    model = PageElement


class ArticleCommentInline(admin.TabularInline):
    model = ArticleComment


class ArticleAdmin(admin.ModelAdmin):
    inlines = [
        ArticleCommentInline
    ]


admin.site.register(Article, ArticleAdmin)
admin.site.register(Page, PageAdmin)
admin.site.register(PageElement, PageElementAdmin)

from django.contrib.auth.models import User
from django.db import models
from django.utils.text import slugify
from django.utils.translation import ugettext_lazy as _
from taggit.managers import TaggableManager


class Page(models.Model):
    name = models.CharField(
        max_length=200,
        unique=True,
        db_index=True,
        verbose_name=_('Pagename')
    )

    slug = models.SlugField(
        verbose_name=_('Page slug'),
        unique=True,
        blank=True
    )

    class Meta:
        verbose_name = _('Page')

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if not self.id:
            # Newly created object, so set slug
            self.slug = slugify(self.name)

        super(Page, self).save(*args, **kwargs)

    def get_page_elements(self):
        return Page.objects.filter(page=self)


class PageElement(models.Model):
    TYPE_IMAGE = 0
    TYPE_TEXT = 1
    TYPE_CHOICES = (
        (TYPE_IMAGE, _('Image element')),
        (TYPE_TEXT, _('Text element'))
    )

    page = models.ForeignKey(
        Page,
        on_delete=models.CASCADE,
        verbose_name=_('Parent page'))

    type = models.IntegerField(
        verbose_name=_('Element type'),
        choices=TYPE_CHOICES)

    body = models.TextField(
        verbose_name=_('Element text'),
        blank=True)

    image_src = models.ImageField(
        verbose_name=_('Element image source'),
        blank=True, null=True)

    description = models.TextField(
        blank=True,
        verbose_name=_('Element description')
    )

    class Meta:
        verbose_name = _('Page element')

    def __str__(self):
        return '{},{}'.format(self.description, self.page)


class Article(models.Model):
    """
    Article model for korde CMS.
    """
    body = models.TextField(
        blank=True,
        verbose_name=_('text'))

    title = models.TextField(
        blank=True,
        verbose_name=_('title'))

    author = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        verbose_name=_('author'))

    author_name = models.TextField(
        blank=True,
        verbose_name=_('author name'))

    last_updated = models.DateTimeField(
        auto_now=True,
        verbose_name=_('last updated'))
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('created at'))

    tags = TaggableManager()

    class Meta:
        verbose_name = _('article')

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.author_name = '{} {}'.format(self.author.first_name, self.author.last_name)
        super(Article, self).save(*args, **kwargs)  # Call the "real" save() method.

    def get_number_of_comments(self):
        return ArticleComment.objects.filter(article=self).count()


class ArticleComment(models.Model):
    """
    Article comments for korde CMS
    """
    text = models.TextField(
        blank=True,
        verbose_name=_('comment text'))

    article = models.ForeignKey(
        Article,
        on_delete=models.CASCADE,
        verbose_name=_('article'))

    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name=_('article author'))

    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = _('article comment')

    def __str__(self):
        return '{}, {}'.format(self.id, self.article)


class ArticleImage(models.Model):
    """
    Article image, related with an article.
    """

    article = models.ForeignKey(
        Article,
        on_delete=models.SET_NULL,
        verbose_name=_('article'),
        null=True)

    src = models.ImageField(
        verbose_name=_('article image'))
    # Tags, example image.tags.add("red", "green", "delicious")
    tags = TaggableManager()

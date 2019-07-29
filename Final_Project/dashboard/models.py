from django.db import models

class Language(models.Model):
    language = models.CharField(max_length = 2)
    count = models.IntegerField()
    def __str__(self):
        return str(self.language)
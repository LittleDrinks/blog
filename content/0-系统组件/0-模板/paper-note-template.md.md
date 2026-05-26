---
title: " {{title}} "
authors: {{authors}}
year: {{date | format("YYYY")}}
citekey: " {{citekey}} "
tags: [literature]
---

# {{title}}

## Abstract

{{abstractNote}}

## Notes

{% for annotation in annotations %}

> {{annotation.annotatedText}}

{% if annotation.comment %}
Comment: {{annotation.comment}}
{% endif %}

{% endfor %}
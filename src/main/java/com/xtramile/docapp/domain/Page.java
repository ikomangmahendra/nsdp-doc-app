package com.xtramile.docapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

/**
 * A Page.
 */
@Document(collection = "page")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Page implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("name")
    private String name;

    @NotNull
    @Field("title")
    private String title;

    @DBRef
    @Field("elements")
    @JsonIgnoreProperties(value = { "page" }, allowSetters = true)
    private Set<Element> elements = new HashSet<>();

    @DBRef
    @Field("section")
    @JsonIgnoreProperties(value = { "pages" }, allowSetters = true)
    private Section section;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Page id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Page name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return this.title;
    }

    public Page title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Set<Element> getElements() {
        return this.elements;
    }

    public void setElements(Set<Element> elements) {
        if (this.elements != null) {
            this.elements.forEach(i -> i.setPage(null));
        }
        if (elements != null) {
            elements.forEach(i -> i.setPage(this));
        }
        this.elements = elements;
    }

    public Page elements(Set<Element> elements) {
        this.setElements(elements);
        return this;
    }

    public Page addElements(Element element) {
        this.elements.add(element);
        element.setPage(this);
        return this;
    }

    public Page removeElements(Element element) {
        this.elements.remove(element);
        element.setPage(null);
        return this;
    }

    public Section getSection() {
        return this.section;
    }

    public void setSection(Section section) {
        this.section = section;
    }

    public Page section(Section section) {
        this.setSection(section);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Page)) {
            return false;
        }
        return getId() != null && getId().equals(((Page) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Page{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", title='" + getTitle() + "'" +
            "}";
    }
}

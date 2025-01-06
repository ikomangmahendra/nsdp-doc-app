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
 * A Section.
 */
@Document(collection = "section")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Section implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    private String id;

    @NotNull
    @Field("section_code")
    private String sectionCode;

    @NotNull
    @Field("section_name")
    private String sectionName;

    @NotNull
    @Field("order_index")
    private Integer orderIndex;

    @DBRef
    @Field("pages")
    @JsonIgnoreProperties(value = { "elements", "section" }, allowSetters = true)
    private Set<Page> pages = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public String getId() {
        return this.id;
    }

    public Section id(String id) {
        this.setId(id);
        return this;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSectionCode() {
        return this.sectionCode;
    }

    public Section sectionCode(String sectionCode) {
        this.setSectionCode(sectionCode);
        return this;
    }

    public void setSectionCode(String sectionCode) {
        this.sectionCode = sectionCode;
    }

    public String getSectionName() {
        return this.sectionName;
    }

    public Section sectionName(String sectionName) {
        this.setSectionName(sectionName);
        return this;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public Integer getOrderIndex() {
        return this.orderIndex;
    }

    public Section orderIndex(Integer orderIndex) {
        this.setOrderIndex(orderIndex);
        return this;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Set<Page> getPages() {
        return this.pages;
    }

    public void setPages(Set<Page> pages) {
        if (this.pages != null) {
            this.pages.forEach(i -> i.setSection(null));
        }
        if (pages != null) {
            pages.forEach(i -> i.setSection(this));
        }
        this.pages = pages;
    }

    public Section pages(Set<Page> pages) {
        this.setPages(pages);
        return this;
    }

    public Section addPages(Page page) {
        this.pages.add(page);
        page.setSection(this);
        return this;
    }

    public Section removePages(Page page) {
        this.pages.remove(page);
        page.setSection(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Section)) {
            return false;
        }
        return getId() != null && getId().equals(((Section) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Section{" +
            "id=" + getId() +
            ", sectionCode='" + getSectionCode() + "'" +
            ", sectionName='" + getSectionName() + "'" +
            ", orderIndex=" + getOrderIndex() +
            "}";
    }
}

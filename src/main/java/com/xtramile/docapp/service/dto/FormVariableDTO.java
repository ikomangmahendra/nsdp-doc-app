package com.xtramile.docapp.service.dto;

import com.xtramile.docapp.domain.enumeration.FormVariableType;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.xtramile.docapp.domain.FormVariable} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FormVariableDTO implements Serializable {

    private String id;

    @NotNull
    @Size(max = 10)
    private String sectionCode;

    @NotNull
    @Size(max = 50)
    private String sectionName;

    @NotNull
    private FormVariableType formVariableType;

    @NotNull
    private Integer orderIndex;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSectionCode() {
        return sectionCode;
    }

    public void setSectionCode(String sectionCode) {
        this.sectionCode = sectionCode;
    }

    public String getSectionName() {
        return sectionName;
    }

    public void setSectionName(String sectionName) {
        this.sectionName = sectionName;
    }

    public FormVariableType getFormVariableType() {
        return formVariableType;
    }

    public void setFormVariableType(FormVariableType formVariableType) {
        this.formVariableType = formVariableType;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FormVariableDTO)) {
            return false;
        }

        FormVariableDTO formVariableDTO = (FormVariableDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, formVariableDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FormVariableDTO{" +
            "id='" + getId() + "'" +
            ", sectionCode='" + getSectionCode() + "'" +
            ", sectionName='" + getSectionName() + "'" +
            ", formVariableType='" + getFormVariableType() + "'" +
            ", orderIndex=" + getOrderIndex() +
            "}";
    }
}

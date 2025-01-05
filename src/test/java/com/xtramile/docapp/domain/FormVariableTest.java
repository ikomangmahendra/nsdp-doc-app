package com.xtramile.docapp.domain;

import static com.xtramile.docapp.domain.FormVariableTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.xtramile.docapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FormVariableTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(FormVariable.class);
        FormVariable formVariable1 = getFormVariableSample1();
        FormVariable formVariable2 = new FormVariable();
        assertThat(formVariable1).isNotEqualTo(formVariable2);

        formVariable2.setId(formVariable1.getId());
        assertThat(formVariable1).isEqualTo(formVariable2);

        formVariable2 = getFormVariableSample2();
        assertThat(formVariable1).isNotEqualTo(formVariable2);
    }
}

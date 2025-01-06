package com.xtramile.docapp.domain;

import static com.xtramile.docapp.domain.ElementTestSamples.*;
import static com.xtramile.docapp.domain.PageTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.xtramile.docapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ElementTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Element.class);
        Element element1 = getElementSample1();
        Element element2 = new Element();
        assertThat(element1).isNotEqualTo(element2);

        element2.setId(element1.getId());
        assertThat(element1).isEqualTo(element2);

        element2 = getElementSample2();
        assertThat(element1).isNotEqualTo(element2);
    }

    @Test
    void pageTest() {
        Element element = getElementRandomSampleGenerator();
        Page pageBack = getPageRandomSampleGenerator();

        element.setPage(pageBack);
        assertThat(element.getPage()).isEqualTo(pageBack);

        element.page(null);
        assertThat(element.getPage()).isNull();
    }
}

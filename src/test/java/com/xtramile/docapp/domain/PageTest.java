package com.xtramile.docapp.domain;

import static com.xtramile.docapp.domain.ElementTestSamples.*;
import static com.xtramile.docapp.domain.PageTestSamples.*;
import static com.xtramile.docapp.domain.SectionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.xtramile.docapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class PageTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Page.class);
        Page page1 = getPageSample1();
        Page page2 = new Page();
        assertThat(page1).isNotEqualTo(page2);

        page2.setId(page1.getId());
        assertThat(page1).isEqualTo(page2);

        page2 = getPageSample2();
        assertThat(page1).isNotEqualTo(page2);
    }

    @Test
    void elementsTest() {
        Page page = getPageRandomSampleGenerator();
        Element elementBack = getElementRandomSampleGenerator();

        page.addElements(elementBack);
        assertThat(page.getElements()).containsOnly(elementBack);
        assertThat(elementBack.getPage()).isEqualTo(page);

        page.removeElements(elementBack);
        assertThat(page.getElements()).doesNotContain(elementBack);
        assertThat(elementBack.getPage()).isNull();

        page.elements(new HashSet<>(Set.of(elementBack)));
        assertThat(page.getElements()).containsOnly(elementBack);
        assertThat(elementBack.getPage()).isEqualTo(page);

        page.setElements(new HashSet<>());
        assertThat(page.getElements()).doesNotContain(elementBack);
        assertThat(elementBack.getPage()).isNull();
    }

    @Test
    void sectionTest() {
        Page page = getPageRandomSampleGenerator();
        Section sectionBack = getSectionRandomSampleGenerator();

        page.setSection(sectionBack);
        assertThat(page.getSection()).isEqualTo(sectionBack);

        page.section(null);
        assertThat(page.getSection()).isNull();
    }
}

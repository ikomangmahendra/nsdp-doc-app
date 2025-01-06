package com.xtramile.docapp.domain;

import static com.xtramile.docapp.domain.PageTestSamples.*;
import static com.xtramile.docapp.domain.SectionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.xtramile.docapp.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class SectionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Section.class);
        Section section1 = getSectionSample1();
        Section section2 = new Section();
        assertThat(section1).isNotEqualTo(section2);

        section2.setId(section1.getId());
        assertThat(section1).isEqualTo(section2);

        section2 = getSectionSample2();
        assertThat(section1).isNotEqualTo(section2);
    }

    @Test
    void pagesTest() {
        Section section = getSectionRandomSampleGenerator();
        Page pageBack = getPageRandomSampleGenerator();

        section.addPages(pageBack);
        assertThat(section.getPages()).containsOnly(pageBack);
        assertThat(pageBack.getSection()).isEqualTo(section);

        section.removePages(pageBack);
        assertThat(section.getPages()).doesNotContain(pageBack);
        assertThat(pageBack.getSection()).isNull();

        section.pages(new HashSet<>(Set.of(pageBack)));
        assertThat(section.getPages()).containsOnly(pageBack);
        assertThat(pageBack.getSection()).isEqualTo(section);

        section.setPages(new HashSet<>());
        assertThat(section.getPages()).doesNotContain(pageBack);
        assertThat(pageBack.getSection()).isNull();
    }
}

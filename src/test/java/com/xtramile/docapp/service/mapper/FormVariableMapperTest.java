package com.xtramile.docapp.service.mapper;

import static com.xtramile.docapp.domain.FormVariableAsserts.*;
import static com.xtramile.docapp.domain.FormVariableTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FormVariableMapperTest {

    private FormVariableMapper formVariableMapper;

    @BeforeEach
    void setUp() {
        formVariableMapper = new FormVariableMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getFormVariableSample1();
        var actual = formVariableMapper.toEntity(formVariableMapper.toDto(expected));
        assertFormVariableAllPropertiesEquals(expected, actual);
    }
}

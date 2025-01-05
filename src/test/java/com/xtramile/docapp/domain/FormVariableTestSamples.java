package com.xtramile.docapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class FormVariableTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static FormVariable getFormVariableSample1() {
        return new FormVariable().id("id1").sectionCode("sectionCode1").sectionName("sectionName1").orderIndex(1);
    }

    public static FormVariable getFormVariableSample2() {
        return new FormVariable().id("id2").sectionCode("sectionCode2").sectionName("sectionName2").orderIndex(2);
    }

    public static FormVariable getFormVariableRandomSampleGenerator() {
        return new FormVariable()
            .id(UUID.randomUUID().toString())
            .sectionCode(UUID.randomUUID().toString())
            .sectionName(UUID.randomUUID().toString())
            .orderIndex(intCount.incrementAndGet());
    }
}

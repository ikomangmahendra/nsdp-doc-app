package com.xtramile.docapp.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;

public class SectionTestSamples {

    private static final Random random = new Random();
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Section getSectionSample1() {
        return new Section().id("id1").sectionCode("sectionCode1").sectionName("sectionName1").orderIndex(1);
    }

    public static Section getSectionSample2() {
        return new Section().id("id2").sectionCode("sectionCode2").sectionName("sectionName2").orderIndex(2);
    }

    public static Section getSectionRandomSampleGenerator() {
        return new Section()
            .id(UUID.randomUUID().toString())
            .sectionCode(UUID.randomUUID().toString())
            .sectionName(UUID.randomUUID().toString())
            .orderIndex(intCount.incrementAndGet());
    }
}

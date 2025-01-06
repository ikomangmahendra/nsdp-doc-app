package com.xtramile.docapp.domain;

import java.util.UUID;

public class PageTestSamples {

    public static Page getPageSample1() {
        return new Page().id("id1").name("name1").title("title1");
    }

    public static Page getPageSample2() {
        return new Page().id("id2").name("name2").title("title2");
    }

    public static Page getPageRandomSampleGenerator() {
        return new Page().id(UUID.randomUUID().toString()).name(UUID.randomUUID().toString()).title(UUID.randomUUID().toString());
    }
}

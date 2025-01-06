package com.xtramile.docapp.domain;

import java.util.UUID;

public class ElementTestSamples {

    public static Element getElementSample1() {
        return new Element().id("id1").type("type1").name("name1");
    }

    public static Element getElementSample2() {
        return new Element().id("id2").type("type2").name("name2");
    }

    public static Element getElementRandomSampleGenerator() {
        return new Element().id(UUID.randomUUID().toString()).type(UUID.randomUUID().toString()).name(UUID.randomUUID().toString());
    }
}

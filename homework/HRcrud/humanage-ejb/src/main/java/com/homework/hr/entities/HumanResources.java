package com.homework.hr.entities;

import com.homework.hr.entities.auto._HumanResources;

public class HumanResources extends _HumanResources {

    private static HumanResources instance;

    private HumanResources() {}

    public static HumanResources getInstance() {
        if(instance == null) {
            instance = new HumanResources();
        }

        return instance;
    }
}

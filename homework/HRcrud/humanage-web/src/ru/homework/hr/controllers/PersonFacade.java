/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package ru.homework.hr.controllers;

import java.util.List;
import java.util.logging.Logger;
import javax.ejb.Stateless;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.PersistenceContextType;
import ru.homework.hr.entities.Employee;

/**
 *
 * @author mgr
 */
@Stateless
public class PersonFacade {
    @PersistenceContext
    EntityManager em;
    
    public List<Employee> getEmployees(){
        Logger.getLogger("PersonFacade").info("Requested employee List");
        return em.createNamedQuery("Employee.allEmployeesWHistory").getResultList();
    }
    
}

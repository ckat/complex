/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package ru.homework.hr.web;

import java.util.List;
import java.util.logging.Logger;
import javax.ejb.EJB;
import javax.faces.bean.ManagedBean;
import javax.faces.bean.RequestScoped;
import javax.faces.context.FacesContext;
import ru.homework.hr.controllers.PersonFacade;
import ru.homework.hr.entities.Employee;

/**
 *
 * @author mgr
 */

@ManagedBean
@RequestScoped
public class EmployeeManager {
    Logger logger = Logger.getLogger(EmployeeManager.class.getName());
   
    @EJB
    PersonFacade pf;
    
    private List<Employee> fullEmployees;
    
    
    public List<Employee> getEmployees(){
        logger.info("launched during " + 
                FacesContext.getCurrentInstance().getCurrentPhaseId().toString());
        if (fullEmployees == null){
            fullEmployees = pf.getEmployees();
        }
        else
            logger.info("employees already has been fetched");
        
        return fullEmployees;
    }
}

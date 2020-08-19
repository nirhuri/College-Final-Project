import {
    DELETE_TENANT,
    CREATE_TENANT,
    SET_TENANT
  } from '../actions/BuildingMap';
  import Apartment from '../../models/apartment';

  const initialState = {
    buildingTenants: [],
    myBuilding: []
  };

  export default (state = initialState, action) => {
      switch (action.type) {
        case SET_TENANT: 
            return { 
                ...state,
                buildingTenants: action.tenants,
                myBuilding: action.myBuilding
            }

        case CREATE_TENANT:
            const newApartment = new Apartment(
                action.tenantData.id,
                action.tenantData.userName,
                action.tenantData.street,
                action.tenantData.apartmentNum,
                action.tenantData.tenantEmail,
                action.tenantData.name
            );
            return {
                ...state,
                buildingTenants: state.buildingTenants.concat(newApartment),
                myBuilding: state.myBuilding.concat(newApartment)
            };
        
        case DELETE_TENANT:
            return {
                ...state,
                buildingTenants: state.buildingTenants.filter(
                    tenant => tenant.id !== tenant.pid
                ),
                myBuilding: state.myBuilding.filter(
                    tenant => tenant.id !== tenant.pid
                )
            };
      };
      return state;
  };
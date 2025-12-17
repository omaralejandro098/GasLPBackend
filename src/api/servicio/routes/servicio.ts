/**
 * servicio router
 */

import { factories } from '@strapi/strapi';

//export default factories.createCoreRouter('api::servicio.servicio');
export default {
    routes: [//Aqui ponemos las funciones que van a aparecer en el strapi y de las cuales debemos activarlas
        {
            method: 'GET',
            path: '/servicios',
            handler: 'servicio.find'
        },
        {
            method: 'POST',
            path: '/servicios',
            handler: 'servicio.create'
        },
        {
            method: 'PUT',
            path: '/servicios/:id',
            handler: 'servicio.update'
        },
        {
            method: 'PUT',
            path: '/servicios/operador/:id',
            handler: 'servicio.updateOperador'
        },
        {
            method: 'DELETE',
            path: '/servicios/:id',
            handler: 'servicio.delete'
        },
        {
            method: 'GET',
            path: '/serviciosbyruta',
            handler: 'servicio.getServiciosByRuta'
        },
        {
            method: 'GET',
            path: '/serviciosregistrados',
            handler: 'servicio.verserviciobycliente'
        },
        {
            method: 'GET',
            path: '/serviciosasignados',
            handler: 'servicio.verserviciobyasignado'
        },
        {
            method: 'GET',
            path: '/serviciosprogramados',
            handler: 'servicio.verserviciobyprogramados'
        },
             {
            method: 'GET',
            path: '/serviciossurtidos',
            handler: 'servicio.verserviciobysurtido'
        },
         {
            method: 'GET',
            path: '/servicioscancelados',
            handler: 'servicio.verserviciocancelados'
        },
    ]
}
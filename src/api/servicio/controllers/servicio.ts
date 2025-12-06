/**
 * servicio controller
 */

import { factories } from '@strapi/strapi'
import domicilio from '../../domicilio/controllers/domicilio';
import servicio from '../routes/servicio';

export default factories.createCoreController('api::servicio.servicio', {

    async getServiciosByRuta(ctx) {

    },
    async find(ctx) { //Esta funcion solo trae los datos del usuario logeado
        console.log("Datos del usuario", ctx.state.user);
        const user = ctx.state.user;
        if (user.role.type == 'operador') {
            //modificar el ctx query para agregar el filtro por usuario
            ctx.query = { //Mantiene los filtros originales + los filtros que les ponemos
                populate: {
                    domicilio: true,
                    estado_servicio: true,
                    tipo_servicio: true,
                    ruta: {//DEjamos comentado porque no necesita ruta
                        populate: {
                            personal: {
                                populate: {
                                    users_permissions_user: true
                                }
                            }
                        }
                    }
                },
                //En este filtro lo hacemos con el usuario y ahi solo se maneja con id y no documentId
                filters: {
                    ruta: {
                        personal: {
                            users_permissions_user: {
                                id: {
                                    $eq: user.id
                                }
                            }
                        }
                    }
                }
            }
            const result = await super.find(ctx);
            return result; //Resultado de los datos 
        }
        if (user.role.type !== "operador") {
            const result = await super.find(ctx);
            return result;
        } //Resultado de los datos 
        // } else {//Este el sirve para que ejecute si el rol es diferente a operador
        //     ctx.query = {
        //         populate: {
        //             domicilio: true,
        //             cliente: true,
        //             ruta: true
        //         }
        //     }
        // }

    },

    async updateOperador(ctx) {
        const user = ctx.state.user;
        //const documentId = ctx.params.id (asi tambien funciona pero adentro del if iria (documentId= documentId))
        if (user.role.type == "operador") {//Aqui lo hacemos por el error
            const servicio = await strapi.documents('api::servicio.servicio').findOne({ //Estamos trallendo solo el servicio especifico guardado
                documentId: ctx.params.id,//De esta manera si funciona 
                filters: {
                    ruta: {
                        personal: {
                            users_permissions_user: {
                                id: {
                                    $eq: user.id
                                }
                            }
                        }
                    }
                }

            })

            console.log("Servicio a modificar", servicio) //Aqui solo mostraremos el servicio correcto
            //Si el servicio no existe o no pertenece al usuario , retornamos un error
            if (!servicio) {
                return ctx.unauthorized("No tienes permisos para actualizar el servicio")
            }
            console.log(ctx.request.body.data)
            ctx.request.body.data = { //Aqui hacemos que solo tome el campo que nosotros queremos 

                "estado_servicio": ctx.request.body.data.estado_servicio
            };
            const result = await super.update(ctx)//con esto siempre se tiene que ejecutar
            return result
        }

    },
    async delete(ctx) {
        const user = ctx.state.user;
        const documentId = ctx.params.id //(asi tambien funciona pero adentro del if iria (documentId= documentId))
        if (user.role.type == "operador") {//Aqui lo hacemos por el error
            const servicio = await strapi.documents('api::servicio.servicio').findOne({ //Estamos trallendo solo el servicio especifico guardado
                documentId: documentId,//De esta manera si funciona 
                filters: {
                    ruta: {
                        personal: {
                            users_permissions_user: {
                                id: {
                                    $eq: user.id
                                }
                            }
                        }
                    }
                }

            })

            console.log("Servicio a eliminar", servicio) //Aqui solo mostraremos el servicio correcto
            //Si el servicio no existe o no pertenece al usuario , retornamos un error
            if (!servicio) {
                return ctx.unauthorized("No tienes permisos para actualizar el servicio")
            }
            console.log(ctx.request.body.data)
            const result = await super.delete(ctx)//con esto siempre se tiene que ejecutar
            return result
            console.log("Servicio eliminado", result)
        }
    },
    async verserviciobycliente(ctx) {
        try {
            // 🕐 Rango del día actual
            const hoy = new Date();
            const inicio = new Date(hoy);
            inicio.setHours(0, 0, 0, 0);
            const fin = new Date(hoy);
            fin.setHours(23, 59, 59, 999);

            // 1️⃣ Definir la consulta completa
            ctx.query = {
                populate: {
                    cliente: {
                        populate: {
                            domicilios: true,
                        },
                    },
                    estado_servicio: true, // ✅ corregido
                    tipo_servicio: true,
                    ruta: {
                        populate: {
                            personal: {
                                populate: {
                                    users_permissions_user: true,
                                },
                            },
                        },
                    },
                },
                sort: ['updatedAt:desc'], // 🔥 más recientes arriba
                filters: {
                    updatedAt: {
                        $gte: inicio.toISOString(),
                        $lte: fin.toISOString(),
                    },
                    estado_servicio: {
                        tipo: {
                            $eq: 'Registro', // ✅ solo los registrados
                        },
                    },
                },
            };

            // 2️⃣ Buscar con Strapi
            const servicios = await super.find(ctx);

            // 3️⃣ Validar resultados
            if (!servicios || servicios.data.length === 0) {
                return ctx.notFound('No se encontraron servicios registrados para hoy.');
            }

            // 4️⃣ Devolver los servicios filtrados y ordenados
            return servicios;
        } catch (error) {
            console.error('❌ Error al obtener servicios por cliente:', error);
            return ctx.internalServerError('Ocurrió un error al consultar los servicios.');
        }
    },
    async verserviciobyasignado(ctx) {
        try {
            // 🕐 Rango del día actual
            const hoy = new Date();
            const inicio = new Date(hoy);
            inicio.setHours(0, 0, 0, 0);
            const fin = new Date(hoy);
            fin.setHours(23, 59, 59, 999);

            // 1️⃣ Definir la consulta completa
            ctx.query = {
                populate: {
                    cliente: {
                        populate: {
                            domicilios: true,
                        },
                    },
                    estado_servicio: true, // ✅ corregido
                    tipo_servicio: true,
                    ruta: {
                        populate: {
                            personal: {
                                populate: {
                                    users_permissions_user: true,
                                },
                            },
                        },
                    },
                },
                sort: ['updatedAt:desc'], // 🔥 más recientes arriba
                filters: {
                    updatedAt: {
                        $gte: inicio.toISOString(),
                        $lte: fin.toISOString(),
                    },
                    estado_servicio: {
                        tipo: {
                            $eq: 'Asignado', // ✅ solo los asignados
                        },
                    },
                },
            };

            // 2️⃣ Buscar con Strapi
            const servicios = await super.find(ctx);

            // 3️⃣ Validar resultados
            if (!servicios || servicios.data.length === 0) {
                return ctx.notFound('No se encontraron servicios registrados para hoy.');
            }

            // 4️⃣ Devolver los servicios filtrados y ordenados
            return servicios;
        } catch (error) {
            console.error('❌ Error al obtener servicios por cliente:', error);
            return ctx.internalServerError('Ocurrió un error al consultar los servicios.');
        }
    },
    async verserviciobyprogramados(ctx) {
        try {
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            ctx.query = {
                populate: {
                    cliente: {
                        populate: {
                            domicilios: true,
                        },
                    },
                    estado_servicio: true,
                    tipo_servicio: true,
                    ruta: {
                        populate: {
                            personal: {
                                populate: {
                                    users_permissions_user: true,
                                },
                            },
                        },
                    },
                },
                sort: ['fecha_programado:asc'], // 🔥 próximos primero
                filters: {
                    fecha_programado: {
                        $gte: hoy.toISOString(), // 📅 solo los programados a partir de hoy
                    },
                    estado_servicio: {
                        tipo: {
                            $eq: 'Programado', // ✅ solo los servicios con estado "Programado"
                        },
                    },
                },
            };

            const servicios = await super.find(ctx);

            if (!servicios || servicios.data.length === 0) {
                return ctx.notFound('No se encontraron servicios programados próximos.');
            }

            return servicios;
        } catch (error) {
            console.error('❌ Error al obtener servicios programados:', error);
            return ctx.internalServerError('Ocurrió un error al consultar los servicios programados.');
        }
    },
    async verserviciobysurtido(ctx) {
        try {
            // 🕐 Opcional: rango del día actual
            const hoy = new Date();
            hoy.setHours(0, 0, 0, 0);

            ctx.query = {
                populate: {
                    cliente: {
                        populate: {
                            domicilios: true,
                        },
                    },
                    estado_servicio: true,
                    tipo_servicio: true,
                    ruta: {
                        populate: {
                            personal: {
                                populate: {
                                    users_permissions_user: true
                                }
                            }
                        }
                    }
                },
                sort: ['updatedAt:desc'], // 🔥 Los surtidos más recientes primero
                filters: {
                    estado_servicio: {
                        tipo: {
                            $eq: 'Surtido', // 🎯 Solo surtidos
                        },
                    }
                    // Si quieres solo los surtidos de HOY, agrega esto:
                    // updatedAt: {
                    //   $gte: hoy.toISOString()
                    // }
                }
            };

            const servicios = await super.find(ctx);

            if (!servicios || servicios.data.length === 0) {
                return ctx.notFound("No se encontraron servicios surtidos.");
            }

            return servicios;
        } catch (error) {
            console.error("❌ Error al obtener servicios surtidos:", error);
            return ctx.internalServerError("Ocurrió un error al consultar los servicios surtidos.");
        }
    },

    async verserviciocancelados(ctx) {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    ctx.query = {
      populate: {
        cliente: {
          populate: {
            domicilios: true,
          },
        },
        estado_servicio: true,
        tipo_servicio: true,
        ruta: {
          populate: {
            personal: {
              populate: {
                users_permissions_user: true
              }
            }
          }
        }
      },
      sort: ['updatedAt:desc'],
      filters: {
        estado_servicio: {
          tipo: {
            $eq: 'Cancelado', 
          },
        }
      }
    };

    const response = await super.find(ctx);
    return response;

  } catch (error) {
    console.error("❌ Error cargando servicios cancelados", error);
    return ctx.badRequest("Error cargando servicios cancelados");
  }
}


});

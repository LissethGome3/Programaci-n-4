Vue.component('v-select-categoria',VueSelect.VueSelect);
Vue.component('cliente',{
    data:()=>{
        return {
            buscar:'',
            clientes:[],
            categorias:[],
            cliente:{
                accion : 'nuevo',
                mostrar_msg : false,
                msg : '',
                categoria: {
                    id: '',
                    label: '',
                },
                idcliente : '',
                codigo: '',
                nombre: '',
                marca : '',
                precio : '',
            }
        }
    },
    methods:{
        buscandocliente(){
            this.obtenerclientes(this.buscar);
        },
        eliminarcliente(cliente){
            if( confirm(`Esta seguro de eliminar el cliente ${cliente.nombre}?`) ){
                this.cliente.accion = 'eliminar';
                this.cliente.idcliente = cliente.idcliente;
                this.guardarcliente();
            }
            this.nuevocliente();
        },
        modificarcliente(datos){
            this.cliente = JSON.parse(JSON.stringify(datos));
            this.cliente.accion = 'modificar';
        },
        guardarcliente(){
            this.obtenerclientes();
            let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            if(this.cliente.accion=="nuevo"){
                this.cliente.idcliente = generarIdUnicoFecha();
                clientes.push(this.cliente);
            } else if(this.cliente.accion=="modificar"){
                let index = clientes.findIndex(cliente=>cliente.idcliente==this.cliente.idcliente);
                clientes[index] = this.cliente;
            } else if( this.cliente.accion=="eliminar" ){
                let index = clientes.findIndex(cliente=>cliente.idcliente==this.cliente.idcliente);
                clientes.splice(index,1);
            }
            localStorage.setItem('clientes', JSON.stringify(clientes));
            this.nuevocliente();
            this.obtenerclientes();
            this.cliente.msg = 'cliente procesado con exito';
        },
        obtenerclientes(valor=''){
            this.clientes = [];
            let clientes = JSON.parse(localStorage.getItem('clientes')) || [];
            this.clientes = clientes.filter(cliente=>cliente.nombre.toLowerCase().indexOf(valor.toLowerCase())>-1);

            this.categorias = [];
            let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
            this.categorias = categorias.map(categoria=>{
                return {
                    id: categoria.idCategoria,
                    label: categoria.nombre,
                }
            });
        },
        nuevocliente(){
            this.cliente.accion = 'nuevo';
            this.cliente.msg = '';
            this.cliente.idcliente = '';
            this.cliente.codigo = '';
            this.cliente.nombre = '';
            this.cliente.marca = '';
            this.cliente.precio = '';
        }
    },
    created(){
        this.obtenerclientes();
    },
    template:`
        <div id="appCiente">
            <div class="card text-white" id="carcliente">
                <div class="card-header bg-primary">
                    Registro de clientes
                    <button type="button" class="btn-close text-end" data-bs-dismiss="alert" data-bs-target="#carcliente" aria-label="Close"></button>
                </div>
                <div class="card-body text-dark">
                    <form method="post" @submit.prevent="guardarcliente" @reset="nuevocliente">
                        <div class="row p-1">
                            <div class="col col-md-2">
                                Categoria:
                            </div>
                            <div class="col col-md-3">
                                <v-select-categoria v-model="cliente.categoria" 
                                    :options="categorias" placeholder="Seleccione una categoria"/>
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Codigo:</div>
                            <div class="col col-md-2">
                                <input title="Ingrese el codigo" v-model="cliente.codigo" pattern="[0-9]{3,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Nombre:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el nombre" v-model="cliente.nombre" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Marca:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese la marca" v-model="cliente.marca" pattern="[A-Za-zñÑáéíóúü ]{3,75}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-2">Precio:</div>
                            <div class="col col-md-3">
                                <input title="Ingrese el Precio" v-model="cliente.precio" pattern="[0-9.]{1,10}" required type="text" class="form-control">
                            </div>
                        </div>
                        <div class="row p-1">
                            <div class="col col-md-5 text-center">
                                <div v-if="cliente.mostrar_msg" class="alert alert-primary alert-dismissible fade show" role="alert">
                                    {{ cliente.msg }}
                                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                                </div>
                            </div>
                        </div>
                        <div class="row m-2">
                            <div class="col col-md-5 text-center">
                                <input class="btn btn-success" type="submit" value="Guardar">
                                <input class="btn btn-warning" type="reset" value="Nuevo">
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="card text-white" id="carBuscarcliente">
                <div class="card-header bg-primary">
                    Busqueda de clientes
                    <button type="button" class="btn-close" data-bs-dismiss="alert" data-bs-target="#carBuscarcliente" aria-label="Close"></button>
                </div>
                <div class="card-body">
                    <table class="table table-dark table-hover">
                        <thead>
                            <tr>
                                <th colspan="6">
                                    Buscar: <input @keyup="buscandocliente" v-model="buscar" placeholder="buscar aqui" class="form-control" type="text" >
                                </th>
                            </tr>
                            <tr>
                                <th>CODIGO</th>
                                <th>NOMBRE</th>
                                <th>MARCA</th>
                                <th>PRECIO</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in clientes" @click='modificarcliente( item )' :key="item.idcliente">
                                <td>{{item.codigo}}</td>
                                <td>{{item.nombre}}</td>
                                <td>{{item.marca}}</td>
                                <td>{{item.precio}}</td>
                                <td>
                                    <button class="btn btn-danger" @click="eliminarcliente(item)">Eliminar</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `
});
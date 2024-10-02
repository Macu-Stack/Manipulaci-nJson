import { Component, OnInit } from '@angular/core';
import { Usuario } from './Models/Usuario.interface'; 
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  usuarios: Usuario[] = []; 
  nuevoUsuario: Usuario = { id: 0, nombre: '', email: '', empresa: '' };
  usuarioModificar: Usuario | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }
  
  obtenerUsuarios() {
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users').subscribe(data => {
      this.usuarios = data.map(user => ({
        id: user.id,  
        nombre: user.name,
        email: user.email,
        empresa: user.company.name      
      }));   
    });
  }

  agregarUsuario() {
    const maxId = this.usuarios.length > 0 ? Math.max(...this.usuarios.map(u => u.id)) : 0;
    this.nuevoUsuario.id = maxId + 1; 

    const body = {
      name: this.nuevoUsuario.nombre,
      email: this.nuevoUsuario.email,
      company: {
        name: this.nuevoUsuario.empresa
      }
    };

    this.http.post<any>('https://jsonplaceholder.typicode.com/users', body).subscribe(response => {
      console.log('Usuario Agregado', response);
      this.usuarios.push({
        id: this.nuevoUsuario.id, 
        nombre: this.nuevoUsuario.nombre,
        email: this.nuevoUsuario.email,
        empresa: this.nuevoUsuario.empresa
      });
      this.nuevoUsuario = { id: 0, nombre: '', email: '', empresa: '' }; 
    });
  }

  modificarUsuario() {
    const usuario = this.usuarioModificar;
    if (!usuario) return;
  
    const body = {
      name: usuario.nombre,
      email: usuario.email,
      company: {
        name: usuario.empresa
      }
    };
  
    if (usuario.id <= 10) { 
      this.http.put<any>(`https://jsonplaceholder.typicode.com/users/${usuario.id}`, body).subscribe(response => {
        console.log('Usuario Modificado', response);
        const index = this.usuarios.findIndex(u => u.id === usuario.id);
        if (index !== -1) {
          this.usuarios[index] = {
            ...this.usuarios[index],
            nombre: usuario.nombre,
            email: usuario.email,
            empresa: usuario.empresa
          };
        }
        this.usuarioModificar = null;
      }, error => {
        console.error('Error al modificar el usuario', error);
      });
    } else { 
      const index = this.usuarios.findIndex(u => u.id === usuario.id);
      if (index !== -1) {
        this.usuarios[index] = {
          ...this.usuarios[index],
          nombre: usuario.nombre,
          email: usuario.email,
          empresa: usuario.empresa
        };
      }
      this.usuarioModificar = null;
      console.log('Usuario Modificado Localmente', usuario);
    }
  }

  eliminarUsuario(id: number) {
    this.http.delete<any>(`https://jsonplaceholder.typicode.com/users/${id}`).subscribe(response => {
      console.log('Usuario Eliminado', response);
      this.usuarios = this.usuarios.filter(u => u.id !== id);
    });
  }

  seleccionarUsuario(usuario: Usuario) {
    this.usuarioModificar = { ...usuario };
  }

  limpiarSeleccion() {
    this.usuarioModificar = null;
  }
}
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
      img {
        width: 100%;
        border-radius: 5px;
      }
    `,
  ],
})
export class AgregarComponent implements OnInit {
  publishers = [
    { id: 'DC Comics', desc: 'DC-Comics' },
    { id: '', desc: 'Marvel - Comics' },
  ];
  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: '',
  };
  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    if (this.router.url.includes('editar')) {
      this.activatedRoute.params
        .pipe(switchMap(({ id }) => this.heroesService.getHeroeById(id)))
        .subscribe((heroe) => {
          this.heroe = heroe;
        });
    }
  }
  guardar() {
    if (this.heroe.superhero.trim().length === 0) {
      return;
    }
    if (this.heroe.id) {
      console.log('entro aqui', this.heroe);
      this.heroesService.actualizarHeroe(this.heroe).subscribe((heroe) => {
        console.log('Actualizando', heroe);
        this.mostrarSnackBar('Registro Actualizado');
      });
    } else {
      this.heroesService.agregarHeroe(this.heroe).subscribe((heroe) => {
        console.log('La respuesta es=>', heroe);
        this.router.navigate(['/heroes/editar', heroe.id]);
      });
    }
  }
  borrarHeroe() {
    const dialog = this.dialog.open(ConfirmarComponent, {
      width: '250px',
      data: { ...this.heroe },
    });
    dialog.afterClosed().subscribe((response) => {
      if (response) {
        this.heroesService.borrarHeroe(this.heroe.id!).subscribe((response) => {
          this.router.navigate(['/heroes']);
        });
      }
    });
  }
  mostrarSnackBar(mensaje: string) {
    this.snackBar.open(mensaje, 'Ok', {
      duration: 2000,
    });
  }
}

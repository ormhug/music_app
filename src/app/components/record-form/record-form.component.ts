import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Нужно для работы форм
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { MusicRecord } from '../../models/models';

@Component({
  selector: 'app-record-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './record-form.html', //Ссылка на html
  styles: []
})
export class RecordFormComponent implements OnInit {
  //модель данных для формы
  record: MusicRecord = {
    id: 0,
    title: '',
    artist: '',
    format: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    price: 0,
    stockQty: 0,
    // поля покупателя
    customerId: '',
    customerFirstName: '',
    customerLastName: '',
    customerContact: '',
    customerEmail: ''
  };

  isEditMode = false;
  formats: string[] = [];
  genres: string[] = [];
  errorMessage = '';

  constructor(
    private recordService: RecordService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // загружаем списки для выпадающих меню
    this.recordService.getFormats().subscribe(data => this.formats = data);
    this.recordService.getGenres().subscribe(data => this.genres = data);

    // проверяем, есть ли ID в адресе (редактирование или создание?)
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.recordService.getRecord(Number(id)).subscribe({
        next: (data) => this.record = data,
        error: () => this.errorMessage = 'Could not load record'
      });
    }
  }

  onSubmit(form: any) {
    if (form.valid) {
      if (this.isEditMode) {
        this.updateRecord();
      } else {
        this.createRecord();
      }
    } else {
      //если форма невалидна, браузер сам подсветит поля (благодаря HTML валидации)
      this.errorMessage = 'Please fix the errors in the form before saving.';
    }
  }

  createRecord() {
    // при создании ID генерирует бэкенд, но нам нужно передать объект
    this.recordService.addRecord(this.record).subscribe({
      next: () => this.router.navigate(['/records']),
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error creating record';
      }
    });
  }

  updateRecord() {
    this.recordService.updateRecord(this.record.id, this.record).subscribe({
      next: () => this.router.navigate(['/records']),
      error: (err) => {
        console.error(err);
        this.errorMessage = 'Error updating record';
      }
    });
  }
}
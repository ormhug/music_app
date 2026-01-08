import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { AuthService } from '../../services/auth.service';
import { MusicRecord, User } from '../../models/models';
import { StockStatusPipe } from '../../pipes/stock-status-pipe';

// это для экспорта в пдф и эксел
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-record-list',
  standalone: true,
  imports: [CommonModule, RouterLink, StockStatusPipe], //подключаем наш пайп
  templateUrl: './record-list.html', //мой файл шаблона
  styles: []
})
export class RecordListComponent implements OnInit {
  records: MusicRecord[] = [];
  currentUser: User | null = null;

  constructor(
    private recordService: RecordService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // 1. получаем текущего юзера (чтобы знать, показывать ли кнопки Edit/Delete)
    this.currentUser = this.authService.getUser();

    // 2. загружаем пластинки
    this.loadRecords();
  }

  loadRecords() {
    this.recordService.getRecords().subscribe({
      next: (data) => {
        this.records = data;
      },
      error: (err) => console.error('Error fetching records', err)
    });
  }

  // метод для удаления (только для админа)
  deleteRecord(id: number) {
    if (confirm('Are you sure you want to delete this record?')) {
      this.recordService.deleteRecord(id).subscribe(() => {
        // после удаления обновляем список
        this.loadRecords();
      });
    }
  }

  // проверка прав для скрытия кнопок в HTML
  canEdit(): boolean {
    const role = this.currentUser?.role;
    return role === 'admin' || role === 'manager';
  }

  canDelete(): boolean {
    return this.currentUser?.role === 'admin';
  }

  //ну экспорт в пдф

  exportToPdf() {
    const doc = new jsPDF();

    const head = [['ID', 'Title', 'Artist', 'Format', 'Genre', 'Price', 'Stock']];
    
    const data = this.records.map(r => [
      r.id, 
      r.title, 
      r.artist, 
      r.format, 
      r.genre, 
      r.price + ' EUR', 
      r.stockQty
    ]);

    autoTable(doc, {
      head: head,
      body: data,
      //логика раскраски строк по жанру
      didParseCell: (data) => {
        if (data.section === 'body') {
          const genre = this.records[data.row.index].genre;
          
          //цвета для разных жанров
          if (genre === 'Rock') {
            data.cell.styles.fillColor = [255, 200, 200]; 
          } else if (genre === 'Pop') {
            data.cell.styles.fillColor = [200, 255, 200]; 
          } else if (genre === 'Jazz') {
            data.cell.styles.fillColor = [200, 200, 255]; 
          } else if (genre === 'Hip-Hop') {
            data.cell.styles.fillColor = [255, 255, 200]; 
          } else if (genre === 'Classical') {
            data.cell.styles.fillColor = [230, 230, 230]; 
          } else if (genre === 'Electronic') {
            data.cell.styles.fillColor = [200, 255, 255]; 
          } else if (genre === 'Alternative') {
            data.cell.styles.fillColor = [230, 200, 250]; // Светло-фиолетовый (New)
          } else if (genre === 'Reggae') {
            data.cell.styles.fillColor = [255, 215, 180]; // Светло-оранжевый (New)
          }
        }
      }
    });

    doc.save('records-list.pdf');
  }

  // экспорт эксел
  exportToExcel() {
    //готовим данные
    const data = this.records.map(r => ({
      ID: r.id,
      Title: r.title,
      Artist: r.artist,
      Format: r.format,
      Genre: r.genre,
      Price: r.price,
      Stock: r.stockQty
    }));

    //создаем лист
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    
    //создаем книгу
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Records');

    //сохраняем файл
    XLSX.writeFile(wb, 'records-list.xlsx');
  }
}

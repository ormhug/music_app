import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RecordService } from '../../services/record.service';
import { MusicRecord } from '../../models/models';

@Component({
  selector: 'app-record-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './record-detail.html',
  styles: [] 
})
export class RecordDetailComponent implements OnInit {
  record: MusicRecord | null = null;

  constructor(
    private route: ActivatedRoute,
    private recordService: RecordService
  ) {}

  ngOnInit(): void {
    // Получаем ID из адресной строки (например, records/1 -> id=1)
    const id = Number(this.route.snapshot.paramMap.get('id'));
    
    if (id) {
      this.recordService.getRecord(id).subscribe({
        next: (data) => {
          this.record = data;
        },
        error: (err) => console.error('Error loading record', err)
      });
    }
  }
}
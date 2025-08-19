import { Component, OnInit } from '@angular/core';
import { Rocket } from '../../core/interface/Interface';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { CommonModule } from '@angular/common';
import { ColDef } from 'ag-grid-community';
import { AgGridModule } from 'ag-grid-angular';

@Component({
  selector: 'app-rockets',
  imports: [CommonModule, AgGridModule],
  templateUrl: './rockets.component.html',
  styleUrl: './rockets.component.css',
})
export class RocketsComponent implements OnInit {
  //   rockets: Rocket[] = [];
  //   loading = false;
  //   error = '';

  //   constructor(private api: SpacexApiService) {}

  //   ngOnInit(): void {
  //     this.loading = true;
  //     this.api.getAllRockets().subscribe({
  //       next: (data) => {
  //         this.rockets = data;
  //         this.loading = false;
  //       },
  //       error: (_) => {
  //         this.error = 'Failed to load rockets.';
  //         this.loading = false;
  //       },
  //     });
  //   }
  // }

  rockets: Rocket[] = [];
  loading = false;
  error = '';
  columnDefs: ColDef<Rocket>[] = [
    { headerName: 'Name', field: 'name', sortable: true, filter: true },
    { headerName: 'Type', field: 'type', sortable: true, filter: true },
    { headerName: 'Stages', field: 'stages', sortable: true, filter: true },
    {
      headerName: 'Description',
      field: 'description',
      flex: 2,
      wrapText: true,
      autoHeight: true,
      valueFormatter: (params) => {
        const desc = params.value || '';
        return desc.length > 150 ? desc.slice(0, 150) + '...' : desc;
      },
    },
  ];

  defaultColDef: ColDef = {
    flex: 1,
    minWidth: 120,
    resizable: true,
  };

  constructor(private api: SpacexApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getAllRockets().subscribe({
      next: (data) => {
        this.rockets = data;
        this.loading = false;
      },
      error: (_) => {
        this.error = 'Failed to load rockets.';
        this.loading = false;
      },
    });
  }
}

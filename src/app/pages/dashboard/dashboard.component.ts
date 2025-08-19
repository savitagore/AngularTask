import { Component } from '@angular/core';
import { Launch, Rocket } from '../../core/interface/Interface';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, AgGridModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  view: 'past' | 'upcoming' = 'past';
  launches: Launch[] = [];
  rockets = new Map<string, Rocket>();
  loading = false;
  error = '';
  displayed: Launch[] = [];
  sortKey: 'date' | 'name' = 'date';
  sortAsc = true;
  pageSize = 12;
  currentPage = 1;
  totalCount = 0;

  filterForm = new FormGroup({
    year: new FormControl(''),
    status: new FormControl('all'),
  });

  columnDefs: ColDef[] = [
    {
      headerName: 'Name',
      field: 'name',
      sortable: true,
      filter: true,
      cellClass: 'text-center',
    },
    {
      headerName: 'Date',
      field: 'date_utc',
      sortable: true,
      filter: true,
      cellClass: 'text-center',
      valueFormatter: (p) =>
        p.value
          ? new Date(p.value).toLocaleDateString('en-IN', { dateStyle: 'long' })
          : '',
    },
    {
      headerName: 'Rocket',
      field: 'rocket',
      sortable: true,
      filter: true,
      cellClass: 'text-center',
      valueGetter: (p) => this.rockets.get(p.data.rocket)?.name || '',
    },
    {
      headerName: 'Status',
      field: 'success',
      cellClass: 'text-center',
      cellRenderer: (p: any) => {
        if (p.data.upcoming) {
          return `<span style="color: gray">Upcoming</span>`;
        }
        if (p.value === true) {
          return `<span style="color: green">Success</span>`;
        }
        if (p.value === false) {
          return `<span style="color: red">Failure</span>`;
        }
        return `<span style="color: orange">Unknown</span>`;
      },
    },
    {
      headerName: 'Action',
      cellClass: 'text-center',
      cellRenderer: (p: any) =>
        `<a href="/launch/${p.data.id}" class="btn btn-sm btn-primary rounded-pill">View Details</a>`,
    },
  ];

  defaultColDef: ColDef = {
    resizable: true,
    sortable: true,
    filter: true,
    flex: 1,
  };

  constructor(private api: SpacexApiService) {}

  ngOnInit() {
    this.filterForm.valueChanges.subscribe(() => this.applyFilters());
    this.loadLaunches();
  }

  toggleView(v: 'past' | 'upcoming') {
    this.view = v;
    this.currentPage = 1;
    this.loadLaunches();
  }

  loadLaunches() {
    this.loading = true;
    this.error = '';
    const fetch =
      this.view === 'past'
        ? this.api.getPast(
            this.pageSize,
            (this.currentPage - 1) * this.pageSize
          )
        : this.api.getUpcoming();

    fetch.subscribe({
      next: (data) => {
        this.launches = data;
        this.totalCount = data.length;
        this.loadRockets();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  loadRockets() {
    const ids = [...new Set(this.launches.map((l) => l.rocket))].filter(
      (id) => !this.rockets.has(id)
    );

    if (ids.length) {
      forkJoin(ids.map((id) => this.api.getRocket(id))).subscribe({
        next: (rockets) => {
          rockets.forEach((r) => this.rockets.set(r.id, r));
          this.applyFilters();
        },
      });
    } else {
      this.applyFilters();
    }
  }

  applyFilters() {
    const { year, status } = this.filterForm.value;
    let filtered = [...this.launches];

    // 🔹 Year filter
    if (year) {
      filtered = filtered.filter(
        (l) => new Date(l.date_utc).getFullYear().toString() === year
      );
    }

    // 🔹 Status filter
    if (status !== 'all') {
      filtered = filtered.filter((l) => {
        if (status === 'success') return l.success === true;
        if (status === 'failure') return l.success === false;
        return true;
      });
    }

    // 🔹 Sorting
    filtered.sort((a, b) => {
      const key = this.sortKey === 'date' ? 'date_utc' : 'name';
      const aVal = (a[key] as string) || '';
      const bVal = (b[key] as string) || '';

      return this.sortAsc ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    // 🔹 Pagination
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.displayed = filtered.slice(start, end);
  }

  changeSort(key: 'date' | 'name') {
    if (this.sortKey === key) {
      this.sortAsc = !this.sortAsc;
    } else {
      this.sortKey = key;
      this.sortAsc = true;
    }
    this.applyFilters();
  }

  retry() {
    this.loadLaunches();
  }

  goPage(n: number) {
    if (n < 1) return;
    this.currentPage = n;
    this.loadLaunches();
  }
}
import React, { useState, useEffect } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

interface Artwork {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const App: React.FC = () => {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedRows, setSelectedRows] = useState<Map<number, Artwork>>(
    new Map()
  );

  useEffect(() => {
    fetchData(page + 1);
  }, [page]);

  const fetchData = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=${rowsPerPage}`
      );
      const { data, pagination } = response.data;

      setArtworks(
        data.map((item: any) => ({
          id: item.id,
          title: item.title,
          place_of_origin: item.place_of_origin || "Unknown",
          artist_display: item.artist_display || "Unknown Artist",
          inscriptions: item.inscriptions || "",
          date_start: item.date_start || "N/A",
          date_end: item.date_end || "N/A",
        }))
      );
      setTotalRecords(pagination.total);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const onPageChange = (event: any) => {
    setPage(event.page);
  };

  const onSelectionChange = (event: any) => {
    const selectedMap = new Map(
      event.value.map((item: Artwork) => [item.id, item])
    );
    setSelectedRows(selectedMap);
  };

  const isSelected = (row: Artwork): boolean => {
    return selectedRows.has(row.id);
  };

  return (
    <div className="p-4">
      <h1>Artworks Table</h1>
      <DataTable
        value={artworks}
        paginator
        rows={rowsPerPage}
        first={page * rowsPerPage}
        totalRecords={totalRecords}
        lazy
        loading={loading}
        onPage={onPageChange}
        selectionMode="checkbox"
        selection={Array.from(selectedRows.values())}
        onSelectionChange={onSelectionChange}
        rowClassName={(row) => (isSelected(row) ? "p-highlight" : "")}
      >
        <Column
          selectionMode="multiple"
          headerStyle={{ width: "3em" }}
        ></Column>
        <Column field="title" header="Title" sortable></Column>
        <Column
          field="place_of_origin"
          header="Place of Origin"
          sortable
        ></Column>
        <Column field="artist_display" header="Artist Display"></Column>
        <Column field="inscriptions" header="Inscriptions"></Column>
        <Column field="date_start" header="Start Date" sortable></Column>
        <Column field="date_end" header="End Date" sortable></Column>
      </DataTable>
    </div>
  );
};

export default App;

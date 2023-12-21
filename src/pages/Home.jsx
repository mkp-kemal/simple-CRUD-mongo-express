import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Home() {
    const navigate = useNavigate();
    const [vehicles, setVehicles] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 5;
    const [loading, setLoading] = useState(true);


    const [vehicleData, setVehicleData] = useState({});
    const updateVehicleData = (data) => {
        setVehicleData(data);
        setFormData(data);
    };

    useEffect(() => {
        getVehicles();
    }, []);

    // GET ALL DATA
    const getVehicles = () => {
        fetch('http://localhost:8000/vehicle', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setVehicles(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    // PAGINATION
    const totalPages = Math.ceil(vehicles.length / rowsPerPage);
    const handlePageChange = page => {
        setCurrentPage(page);
    };
    const getCurrentPageData = () => {
        const startIndex = (currentPage - 1) * rowsPerPage;
        const endIndex = startIndex + rowsPerPage;
        return vehicles.slice(startIndex, endIndex);
    };

    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        vehicle_ID: '',
        img: '',
        production_year: '',
        maximum_weight: '',
        odometer: '',
        complete_documents: '',
        notes: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    // CREATE DATA
    const handleSubmit = () => {
        fetch('http://localhost:8000/vehicle', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                getVehicles();
                showToast("Data berhasil ditambahkan");
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    // UPDATE
    const handleUpdate = (id) => {
        fetch(`http://localhost:8000/vehicle/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                getVehicles();
                showToast("Data berhasil diubah")
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };
    // UPDATE RADIO DOKUMEN
    const handleCompleteDocumentsChange = (e) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            complete_documents: value,
        });
    };

    // DELETE
    const deleteVehicle = (id) => {
        fetch(`http://localhost:8000/vehicle/${id}`, {
            method: 'DELETE',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                getVehicles();
                showToast("Data berhasil di hapus")
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // TOAST
    const showToast = (msg) => {
        toast.success(msg, {
            position: "top-right",
            autoClose: 1000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }

    return (
        <>
            <ToastContainer />
            {loading ? (
                <div className="d-flex align-items-center justify-content-center">
                    <p>
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z" opacity=".5" />
                            <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z"><animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite" to="360 12 12" type="rotate" /></path>
                        </svg>
                    </p>
                </div>
            ) : (
                <div className="my-5 mx-5">
                    <button type="button" className="btn btn-success my-3" data-toggle="modal" data-target="#exampleModal"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10s10-4.477 10-10S17.523 2 12 2m5 11h-4v4h-2v-4H7v-2h4V7h2v4h4z" /></svg> Data Kendaraan</button>
                    <table className="table table-bordered table-dark table-hover">
                        <caption>Data Kendaraan</caption>
                        <thead>
                            <tr className='bg-secondary'>
                                <th scope="col">No</th>
                                <th scope="col">Gambar</th>
                                <th scope="col">Plat Nomor</th>
                                <th scope="col">Nama Kendaraan</th>
                                <th scope="col">Merk</th>
                                <th scope="col">Tahun Produksi</th>
                                <th scope="col">Catatan</th>
                                <th scope="col">Kelengkapan Dokumen</th>
                                <th scope="col">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getCurrentPageData().map((item, index) => (
                                <tr key={index} className={item.complete_documents === 'No' && 'bg-warning'} >
                                    <th scope="row">{(currentPage - 1) * rowsPerPage + index + 1}</th>
                                    <td data-toggle="modal" data-target="#updateModal" onClick={() => updateVehicleData(item)}>
                                        <img src={item.img} alt="img" width={200} />
                                    </td>
                                    <td className="single-line-cell">{item.vehicle_ID}</td>
                                    <td>{item.name}</td>
                                    <td>{item.brand}</td>
                                    <td>{item.production_year}</td>
                                    <td>{item.notes}</td>
                                    <td>
                                        {item.complete_documents === 'Yes' ? 'Lengkap' : 'Rumpang'}
                                    </td>
                                    <td>
                                        {/* <button onClick={() => updateVehicleData(item)} className="btn btn-primary btn-sm mx-2 my-2" data-toggle="modal" data-target="#updateModal">Update</button> */}
                                        <button className="btn btn-danger btn-sm mx-2" data-toggle="modal" data-target="#konfirmasiDelete"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14"><path fill="currentColor" fill-rule="evenodd" d="M5.763 2.013a1.75 1.75 0 0 1 2.914.737H5.323a1.75 1.75 0 0 1 .44-.737m-1.974.737a3.25 3.25 0 0 1 6.422 0H13a.75.75 0 0 1 0 1.5h-1v8.25a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 2 12.5V4.25H1a.75.75 0 1 1 0-1.5zM5 5.876c.345 0 .625.28.625.625v4.002a.625.625 0 0 1-1.25 0V6.501c0-.345.28-.625.625-.625m4.625.625a.625.625 0 0 0-1.25 0v4.002a.625.625 0 0 0 1.25 0z" clip-rule="evenodd" /></svg></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* PAGINATION */}
                    <nav>
                        <ul className="pagination">
                            {/* Previous Page Button */}
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <a
                                    className="page-link"
                                    href="#"
                                    aria-label="Previous"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                >
                                    <span aria-hidden="true">&laquo;</span>
                                </a>
                            </li>
                            {/* Page Buttons */}
                            {Array.from({ length: totalPages }, (_, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                                >
                                    <a
                                        className="page-link"
                                        href="#"
                                        onClick={() => handlePageChange(index + 1)}
                                    >
                                        {index + 1}
                                    </a>
                                </li>
                            ))}
                            {/* Next Page Button */}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <a
                                    className="page-link"
                                    href="#"
                                    aria-label="Next"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                >
                                    <span aria-hidden="true">&raquo;</span>
                                </a>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}

            {/* MODAL ADD */}
            <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Tambah Data Kendaraan</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="vehicle-name" class="col-form-label">Nama Kendaraan</label>
                                    <input onChange={handleChange} type="text" class="form-control" id="vehicle-name" name="name" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-brand" class="col-form-label">Brand</label>
                                    <input onChange={handleChange} type="text" class="form-control" id="vehicle-brand" name="brand" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-id" class="col-form-label">Plat Nomor</label>
                                    <input onChange={handleChange} type="text" class="form-control" id="vehicle-id" name="vehicle_ID" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-img" class="col-form-label">Gambar (URL)</label>
                                    <input onChange={handleChange} type="text" class="form-control" id="vehicle-img" name="img" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-production-year" class="col-form-label">Production Year</label>
                                    <input onChange={handleChange} type="text" class="form-control" id="vehicle-production-year" name="production_year" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-maximum-weight" class="col-form-label">Maximum Weight</label>
                                    <input onChange={handleChange} type="text" class="form-control" id="vehicle-maximum-weight" name="maximum_weight" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-odometer" class="col-form-label">Odometer</label>
                                    <input onChange={handleChange} type="text" class="form-control" id="vehicle-odometer" name="odometer" />
                                </div>
                                <div class="form-group">
                                    <select class="form-select" name='complete_documents' onChange={handleChange} aria-label="Default select example">
                                        <option selected>Pilih kelengkapan dokumen</option>
                                        <option value="Yes">Lengkap</option>
                                        <option value="No">Tidak Lengkap</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-notes" class="col-form-label">Notes</label>
                                    <input onChange={handleChange} type="text" class="form-control" id="vehicle-notes" name="notes" />
                                </div>
                            </form>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success" onClick={handleSubmit} data-dismiss="modal">Simpan</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL UPDATE */}
            <div class="modal fade" id="updateModal" tabindex="-1" role="dialog" aria-labelledby="updateModalLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header">
                            <h5 class="modal-title" id="updateModalLabel">Update Data</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <form>
                                <div class="form-group">
                                    <label for="vehicle-name" class="col-form-label">Nama Kendaraan</label>
                                    <input onChange={handleChange} value={formData.name} type="text" class="form-control" id="vehicle-name" name="name" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-brand" class="col-form-label">Brand</label>
                                    <input onChange={handleChange} value={formData.brand} type="text" class="form-control" id="vehicle-brand" name="brand" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-id" class="col-form-label">Plat Nomor</label>
                                    <input onChange={handleChange} value={formData.vehicle_ID} type="text" class="form-control" id="vehicle-id" name="vehicle_ID" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-img" class="col-form-label">Gambar (URL)</label>
                                    <input onChange={handleChange} value={formData.img} type="text" class="form-control" id="vehicle-img" name="img" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-production-year" class="col-form-label">Production Year</label>
                                    <input onChange={handleChange} value={formData.production_year} type="text" class="form-control" id="vehicle-production-year" name="production_year" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-maximum-weight" class="col-form-label">Maximum Weight</label>
                                    <input onChange={handleChange} value={formData.maximum_weight} type="text" class="form-control" id="vehicle-maximum-weight" name="maximum_weight" />
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-odometer" class="col-form-label">Odometer</label>
                                    <input onChange={handleChange} value={formData.odometer} type="text" class="form-control" id="vehicle-odometer" name="odometer" />
                                </div>
                                <div class="form-group">
                                    <select class="form-select" onChange={handleCompleteDocumentsChange} value={formData.complete_documents} aria-label="Default select example">
                                        <option selected>Pilih kelengkapan dokumen</option>
                                        <option value="Yes">Lengkap</option>
                                        <option value="No">Tidak Lengkap</option>
                                    </select>
                                </div>
                                <div class="form-group">
                                    <label for="vehicle-notes" class="col-form-label">Notes</label>
                                    <input onChange={handleChange} value={formData.notes} type="text" class="form-control" id="vehicle-notes" name="notes" />
                                </div>
                            </form>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-success" onClick={() => handleUpdate(formData.id)} data-dismiss="modal">Simpan</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* MODAL KONFIRMASI DELETE */}
            <div class="modal fade" id="konfirmasiDelete" tabindex="-1" role="dialog" aria-labelledby="konfirmasiDeleteLabel" aria-hidden="true">
                <div class="modal-dialog" role="document">
                    <div class="modal-content bg-dark text-white">
                        <div class="modal-header">
                            <h5 class="modal-title" id="konfirmasiDeleteLabel">Update Data</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            Yakin mau hapus data?
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-dismiss="modal">Batal</button>
                            <button type="button" class="btn btn-danger" onClick={() => deleteVehicle(item.id)}>Hapus</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Home;

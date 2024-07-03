import { useQuery } from "react-query"
import { getAllCategories, getAllTransactions } from "../server/services"
import { useEffect, useState } from "react"
import { useAtom } from "jotai"
import { currentUserAtom } from "../utils/atom"
import { Modal } from "react-bootstrap"
import Categories from "./Categories"
import Map from "./Map"
import { FaPlus } from "react-icons/fa"
import AddTransaction from "./AddTransaction"
import Select from 'react-select'
import { MdCancel } from "react-icons/md"
import AddBulkTransaction from "./AddBulkTransaction"

const Home = () => {

    const [currentUser, _] = useAtom(currentUserAtom)

    const opts = [
        {
            value: "Jad",
            label: "Jad"
        },
        {
            value: "Khaled",
            label: "Khaled"
        }
    ]

    const typesOps = [
        {
            value: "INCOME",
            label: "Income"
        },
        {
            value: "EXPENSE",
            label: "Expense"
        }
    ]

    const [showCaregoriesModal, setShowCaregoriesModal] = useState(false)
    const [showMapModal, setShowMapModal] = useState(false)
    const [showAddTransactionModal, setShowAddTransactionModal] = useState(false)
    const [showAddBulkTransactionModal, setShowAddBulkTransactionModal] = useState(false)

    const [transactions, setTransactions] = useState([])

    type FilterType = {
        user?: string;
        from?: string;
        to?: string;
        category?: number;
        type?: string;
    };

    const [filters, setFilters] = useState<FilterType>({})
    const [filteredTransactions, setFilteredTransactions] = useState([]);

    useEffect(() => {
        if (Object.keys(filters).length > 0) {
            let filteredTransactions = [...transactions]
            if (filters.user) {
                //@ts-ignore
                filteredTransactions = filteredTransactions.filter(t => t.user === filters.user);
            }
            if (filters.from) {
                //@ts-ignore
                filteredTransactions = filteredTransactions.filter(t => new Date(t.transactionDate) >= new Date(filters.from));
            }
            if (filters.to) {
                //@ts-ignore
                filteredTransactions = filteredTransactions.filter(t => new Date(t.transactionDate) <= new Date(filters.to));
            }
            if (filters.category !== undefined) {
                //@ts-ignore
                filteredTransactions = filteredTransactions.filter(t => t.category.id === filters.category);
            }
            if (filters.type) {
                //@ts-ignore
                filteredTransactions = filteredTransactions.filter(t => filters.type === "INCOME" ? t.category.type === "INCOME" : t.category.type !== "INCOME");
            }

            setFilteredTransactions(filteredTransactions)
        }
    }, [filters, transactions])

    useQuery("transactions", getAllTransactions, {
        onSuccess(data) {
            setTransactions(data)
            if (Object.keys(filters).length === 0) {
                setFilteredTransactions(data)
            }
        }, staleTime: Infinity
    })

    const { data: categories } = useQuery("categories", getAllCategories)
    const categoriesOpts = categories?.map((c: any) => ({ value: c.id as Number, label: c.type + " - " + c.category }))

    const incomes = filteredTransactions?.filter((t: any) => t.category.type === 'INCOME')
    const expenses = filteredTransactions?.filter((t: any) => t.category.type !== 'INCOME')

    const getDefaultStartDate = () => {
        const now = new Date();
        let previousMonth = now.getMonth() - 1;
        let year = now.getFullYear();

        if (previousMonth < 0) {
            previousMonth = 11;
            year -= 1;
        }

        const date = new Date(year, previousMonth, 28);
        return date.toISOString().split('T')[0];
    };

    const getDefaultEndDate = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const date = new Date(year, month, 28);
        return date.toISOString().split('T')[0];
    };

    return (
        <>
            <div className="container my-5 text-white">
                <div className="row my-5">
                    <div className="col-sm">
                        <h3>Welcome <b>{currentUser}</b></h3>
                    </div>
                    <div className="col-sm text-end">
                        <button type="button" className="btn btn-secondary me-3" onClick={() => setShowCaregoriesModal(true)}>Categories</button>
                        <button type="button" className="btn btn-secondary" onClick={() => setShowMapModal(true)}>Map</button>
                    </div>
                </div>
                <div className="my-5">
                    <button type="button" className="btn btn-secondary me-3" onClick={() => setShowAddTransactionModal(true)}><FaPlus className="me-2" /> Transaction</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowAddBulkTransactionModal(true)}><FaPlus className="me-2" /> Bulk Transactions</button>
                </div>
                <div className="row my-5">
                    <div className="col-sm">
                        <label>User</label>
                        <Select
                            options={opts}
                            onChange={(e) => setFilters({ ...filters, user: e?.value })}
                            menuPlacement="auto"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#343a40',
                                    borderColor: '#454d55',
                                    color: 'white',
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#343a40',
                                    color: 'white',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: 'white',
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isSelected ? '#007bff' : '#343a40',
                                    color: state.isSelected ? 'white' : 'white',
                                    '&:hover': {
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                    },
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    color: '#6c757d',
                                }),
                                input: (provided) => ({
                                    ...provided,
                                    color: 'white',
                                }),
                            }}
                            isClearable
                        />
                    </div>
                    <div className="col-sm">
                        <label>Category</label>
                        <Select
                            options={categoriesOpts}
                            onChange={(e: any) => setFilters({ ...filters, category: e?.value })}
                            menuPlacement="auto"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#343a40',
                                    borderColor: '#454d55',
                                    color: 'white',
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#343a40',
                                    color: 'white',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: 'white',
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isSelected ? '#007bff' : '#343a40',
                                    color: state.isSelected ? 'white' : 'white',
                                    '&:hover': {
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                    },
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    color: '#6c757d',
                                }),
                                input: (provided) => ({
                                    ...provided,
                                    color: 'white',
                                }),
                            }}
                            isClearable
                        />
                    </div>
                    <div className="col-sm">
                        <label>Type</label>
                        <Select
                            options={typesOps}
                            onChange={(e: any) => setFilters({ ...filters, type: e?.value })}
                            menuPlacement="auto"
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#343a40',
                                    borderColor: '#454d55',
                                    color: 'white',
                                }),
                                menu: (provided) => ({
                                    ...provided,
                                    backgroundColor: '#343a40',
                                    color: 'white',
                                }),
                                singleValue: (provided) => ({
                                    ...provided,
                                    color: 'white',
                                }),
                                option: (provided, state) => ({
                                    ...provided,
                                    backgroundColor: state.isSelected ? '#007bff' : '#343a40',
                                    color: state.isSelected ? 'white' : 'white',
                                    '&:hover': {
                                        backgroundColor: '#007bff',
                                        color: 'white',
                                    },
                                }),
                                placeholder: (provided) => ({
                                    ...provided,
                                    color: '#6c757d',
                                }),
                                input: (provided) => ({
                                    ...provided,
                                    color: 'white',
                                }),
                            }}
                            isClearable
                        />
                    </div>
                    <div className="col-sm">
                        <div className="form-group custom-date-input">
                            <label>From</label>
                            <input type="date" className="form-control form-control-dark" defaultValue={getDefaultStartDate()} onChange={(e) => setFilters({ ...filters, from: e?.target.value })} />
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="form-group custom-date-input">
                            <label>To</label>
                            <input type="date" className="form-control form-control-dark" defaultValue={getDefaultEndDate()} onChange={(e) => setFilters({ ...filters, to: e?.target.value })} />
                        </div>
                    </div>
                </div>
                <div className="row my-5">
                    <div className="col-sm">
                        <div className="card text-white bg-dark mb-3">
                            <div className="card-header">
                                <h5>Total Income:</h5>
                            </div>
                            <div className="card-body text-success">
                                {incomes?.map((i: any) => i.value)?.reduce((a: any, b: any) => a + b, 0)} &euro;
                            </div>
                        </div>
                    </div>
                    <div className="col-sm">
                        <div className="card text-white bg-dark mb-3">
                            <div className="card-header">
                                <h5>Total Expenses:</h5>
                            </div>
                            <div className="card-body text-danger">
                                {expenses?.map((i: any) => i.value)?.reduce((a: any, b: any) => a + b, 0)} &euro;
                            </div>
                        </div>
                    </div>
                </div>
                <div className="my-5">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th>Transaction</th>
                                <th>User</th>
                                <th>Value</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransactions?.map((transaction: any) => (
                                <tr key={transaction.id}>
                                    <td>{transaction.category.type} - {transaction.category.category}</td>
                                    <td>{transaction.user}</td>
                                    <td className={`${transaction.category.type === 'INCOME' ? "text-success" : "text-danger"}`}>{transaction.value} &euro;</td>
                                    <td>{new Date(transaction.transactionDate).toLocaleString('en-US', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal show={showCaregoriesModal} onHide={() => setShowCaregoriesModal(false)} size="xl" dialogClassName="dark-modal" centered>
                <Modal.Header className="d-flex justify-content-between">
                    <h4>Categories</h4>
                    <span onClick={() => setShowCaregoriesModal(false)} className="close-btn"><MdCancel fill="#fffff" /></span>
                </Modal.Header>
                <Modal.Body>
                    <Categories />
                </Modal.Body>
            </Modal>
            <Modal show={showMapModal} onHide={() => setShowMapModal(false)} size="xl" dialogClassName="dark-modal" centered>
                <Modal.Header className="d-flex justify-content-between">
                    <h4>Mapping</h4>
                    <span onClick={() => setShowMapModal(false)} className="close-btn"><MdCancel fill="#fffff" /></span>
                </Modal.Header>
                <Modal.Body>
                    <Map />
                </Modal.Body>
            </Modal>
            <Modal show={showAddTransactionModal} onHide={() => setShowAddTransactionModal(false)} size="xl" dialogClassName="dark-modal" centered>
                <Modal.Header className="d-flex justify-content-between">
                    <h4><FaPlus className="me-2" /> Transaction</h4>
                    <span onClick={() => setShowAddTransactionModal(false)} className="close-btn"><MdCancel fill="#fffff" /></span>
                </Modal.Header>
                <Modal.Body>
                    <AddTransaction setShowAddTransactionModal={setShowAddTransactionModal} />
                </Modal.Body>
            </Modal>
            <Modal show={showAddBulkTransactionModal} onHide={() => setShowAddBulkTransactionModal(false)} size="xl" dialogClassName="dark-modal" centered>
                <Modal.Header className="d-flex justify-content-between">
                    <h4><FaPlus className="me-2" /> Transaction</h4>
                    <span onClick={() => setShowAddBulkTransactionModal(false)} className="close-btn"><MdCancel fill="#fffff" /></span>
                </Modal.Header>
                <Modal.Body>
                    <AddBulkTransaction setShowAddBulkTransactionModal={setShowAddBulkTransactionModal} />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Home
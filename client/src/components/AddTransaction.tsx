import { useMutation, useQuery, useQueryClient } from "react-query"
import { createNewTransaction, getAllCategories } from "../server/services"
import { Controller, useForm } from "react-hook-form"
import Select from "react-select"
import { FaPlus } from "react-icons/fa"
import toast from "react-hot-toast"
import { currentUserAtom } from "../utils/atom"
import { useAtom } from "jotai"

const AddTransaction = ({ setShowAddTransactionModal }: { setShowAddTransactionModal: any }) => {

    const [currentUser, _] = useAtom(currentUserAtom)

    const queryClient = useQueryClient()

    const { register, handleSubmit, control, reset, setValue } = useForm()

    const { data: categories } = useQuery("categories", getAllCategories)
    const categoriesOpts = categories?.map((c: any) => ({ value: c.id, label: c.type + " - " + c.category }))

    const mutateTransaction = useMutation(createNewTransaction, {
        onSuccess(res) {
            if (res) {
                queryClient.invalidateQueries("transactions", { refetchInactive: true })
                reset()
                setValue("category", null)
                toast.success("Transaction added successfully")
                setShowAddTransactionModal(false)
            }
        },
        onError(err) {
            //@ts-ignore
            toast.error(err.response.data.message)
        }
    })

    const onSubmit = (values: any) => {
        const obj = {
            title: values.category.label,
            user: currentUser,
            category: values.category.value,
            value: values.value,
            transactionDate: values.transactionDate
        }
        mutateTransaction.mutate(obj)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-sm my-3">
                    <label>DB Category</label>
                    <Controller
                        name="category"
                        control={control}
                        rules={{ required: { value: true, message: "This field is required" } }}
                        render={({ field: { value, onChange } }) => (
                            <Select
                                options={categoriesOpts}
                                value={value}
                                onChange={onChange}
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
                            />
                        )}
                    />
                </div>
            </div>
            <div className="row">
                <div className="col-sm my-3">
                    <div className="form-group">
                        <label>Value</label>
                        <input {...register("value", { required: true })} type="number" step="any" className="form-control form-control-dark" />
                    </div>
                </div>
                <div className="col-sm my-3">
                    <div className="form-group custom-date-input">
                        <label>Date</label>
                        <input {...register("transactionDate", { required: true })} type="date" className="form-control form-control-dark" />
                    </div>
                </div>
            </div>
            <div className="text-end my-3">
                <button type="submit" className="btn btn-secondary mt-4"><FaPlus className="me-2" /> Add</button>
            </div>
        </form>
    )
}

export default AddTransaction
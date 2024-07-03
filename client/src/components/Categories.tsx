import { useMutation, useQuery, useQueryClient } from "react-query"
import { createNewCategory, deleteCategory, editCategory, getAllCategories } from "../server/services"
import { FaPen, FaPlus, FaTrash } from "react-icons/fa"
import { Controller, useForm } from "react-hook-form"
import Select from "react-select"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"

const Categories = () => {

    const queryClient = useQueryClient()

    const typesOpts = [
        {
            value: "INCOME",
            label: "Income"
        },
        {
            value: "HOME",
            label: "Home"
        },
        {
            value: "SUSBSCRIPTIONS",
            label: "Subscriptions"
        },
        {
            value: "PLANNED_PAYMENTS",
            label: "Planned payments"
        },
        {
            value: "PAYMENTS",
            label: "Payments"
        }
    ]

    const { register, handleSubmit, control, reset, setValue } = useForm()

    const [isEdit, setIsEdit] = useState<number | null>(null)

    const { data: categories } = useQuery("categories", getAllCategories)

    useEffect(() => {
        if (isEdit !== null) {
            let selectedCat = categories.find((c: any) => c.id === isEdit)
            setValue("type", { value: typesOpts.find(t => t.value === selectedCat.type)?.value, label: typesOpts.find(t => t.value === selectedCat.type)?.label })
            setValue("category", selectedCat.category)
        }
    }, [isEdit])

    const mutateCategory = useMutation(isEdit ? editCategory : createNewCategory, {
        onSuccess(res) {
            if (res) {
                queryClient.invalidateQueries("categories", { refetchInactive: true })
                reset()
                setValue("type", null)
                toast.success("Category added successfully")
                setIsEdit(null)
            }
        },
        onError(err) {
            //@ts-ignore
            toast.error(err.response.data.message)
        }
    })
    const removeCategory = useMutation(deleteCategory, {
        onSuccess(res) {
            if (res) {
                queryClient.invalidateQueries("categories", { refetchInactive: true })
                reset()
                setValue("type", null)
                toast.success("Category removed successfully")
            }
        },
        onError(err) {
            //@ts-ignore
            toast.error(err.response.data.message)
        }
    })
    const onSubmit = (values: any) => {
        const obj = {
            category: values.category,
            type: values.type.value
        }
        const editObj = {
            category: values.category,
            type: values.type.value,
            id: isEdit
        }
        mutateCategory.mutate(isEdit ? editObj : obj)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-sm my-3">
                        <div className="form-group">
                            <label>Category</label>
                            <input {...register("category")} type="text" className="form-control form-control-dark" />
                        </div>
                    </div>
                    <div className="col-sm my-3">
                        <label>Type</label>
                        <Controller
                            name="type"
                            control={control}
                            rules={{ required: { value: true, message: "This field is required" } }}
                            render={({ field: { value, onChange } }) => (
                                <Select
                                    options={typesOpts}
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
                    <div className="col-sm my-3">
                        {
                            isEdit ? <button type="submit" className="btn btn-secondary mt-4"><FaPen className="me-2" /> Edit Category</button> : <button type="submit" className="btn btn-secondary mt-4"><FaPlus className="me-2" /> Add Category</button>
                        }
                    </div>
                </div>
            </form>
            <div className="categories-table-wrapper">
                <div className="categories-table-inner">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Type</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories?.map((cat: any) => (
                                <tr key={cat.id}>
                                    <td>{cat.category}</td>
                                    <td>{cat.type}</td>
                                    <td className="text-end">
                                        <button type="button" className="btn btn-primary btn-sm me-3" onClick={() => setIsEdit(cat.id)}><FaPen /></button>
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeCategory.mutate(cat.id)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default Categories
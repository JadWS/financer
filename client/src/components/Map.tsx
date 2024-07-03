import { useMutation, useQuery, useQueryClient } from "react-query"
import { createNewMap, deleteMap, editMap, getAllCategories, getAllMaps } from "../server/services"
import { FaPen, FaPlus, FaTrash } from "react-icons/fa"
import { Controller, useForm } from "react-hook-form"
import Select from "react-select"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"

const Map = () => {

    const queryClient = useQueryClient()

    const { register, handleSubmit, control, reset, setValue } = useForm()

    const [isEdit, setIsEdit] = useState<number | null>(null)

    const { data: categories } = useQuery("categories", getAllCategories)
    const { data: mapping } = useQuery("mapping", getAllMaps)

    const categoriesOpts = categories?.map((c: any) => ({ value: c.id, label: c.type + " - " + c.category }))

    useEffect(() => {
        if (isEdit !== null) {
            let selectedMap = mapping.find((c: any) => c.id === isEdit)
            setValue("DBCategory", { value: categoriesOpts.find((t: any) => t.value === selectedMap.DBCategory.id)?.value, label: categoriesOpts.find((t: any) => t.value === selectedMap.DBCategory.id)?.label })
            setValue("originalCategory", selectedMap.originalCategory)
        }
    }, [isEdit])

    const mutateMap = useMutation(isEdit ? editMap : createNewMap, {
        onSuccess(res) {
            if (res) {
                queryClient.invalidateQueries("mapping", { refetchInactive: true })
                reset()
                setValue("DBCategory", null)
                toast.success("Map added successfully")
                setIsEdit(null)
            }
        },
        onError(err) {
            //@ts-ignore
            toast.error(err.response.data.message)
        }
    })
    const removeMap = useMutation(deleteMap, {
        onSuccess(res) {
            if (res) {
                queryClient.invalidateQueries("mapping", { refetchInactive: true })
                reset()
                setValue("DBCategory", null)
                toast.success("Map removed successfully")
            }
        },
        onError(err) {
            //@ts-ignore
            toast.error(err.response.data.message)
        }
    })
    const onSubmit = (values: any) => {
        const obj = {
            originalCategory: values.originalCategory,
            DBCategory: values.DBCategory.value
        }
        const editObj = {
            originalCategory: values.originalCategory,
            DBCategory: values.DBCategory.value,
            id: isEdit
        }
        mutateMap.mutate(isEdit ? editObj : obj)
    }
    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-sm my-3">
                        <div className="form-group">
                            <label>Original Category</label>
                            <input {...register("originalCategory")} type="text" className="form-control form-control-dark" />
                        </div>
                    </div>
                    <div className="col-sm my-3">
                        <label>DB Category</label>
                        <Controller
                            name="DBCategory"
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
                    <div className="col-sm my-3">
                        {
                            isEdit ? <button type="submit" className="btn btn-secondary mt-4"><FaPen className="me-2" /> Edit Map</button> : <button type="submit" className="btn btn-secondary mt-4"><FaPlus className="me-2" /> Add Map</button>
                        }
                    </div>
                </div>
            </form>
            <div className="categories-table-wrapper">
                <div className="categories-table-inner">
                    <table className="table table-dark">
                        <thead>
                            <tr>
                                <th>Original Category</th>
                                <th>DB Category</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {mapping?.map((map: any) => (
                                <tr key={map.id}>
                                    <td>{map.originalCategory}</td>
                                    <td>{map.DBCategory?.type} - {map.DBCategory?.category}</td>
                                    <td className="text-end">
                                        <button type="button" className="btn btn-primary btn-sm me-3" onClick={() => setIsEdit(map.id)}><FaPen /></button>
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => removeMap.mutate(map.id)}><FaTrash /></button>
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

export default Map
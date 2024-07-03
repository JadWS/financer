
import Papa from 'papaparse';
import { useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';


const AddBulkTransaction = ({ setShowAddBulkTransactionModal }: { setShowAddBulkTransactionModal: any }) => {

    const baseStyle = {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        padding: '1em',
        borderWidth: 1,
        borderRadius: 2,
        borderColor: 'silver',
        borderStyle: 'solid',
        backgroundColor: 'transparent',
        color: '#bdbdbd',
        outline: 'none',
    };

    // const [currentUser, _] = useAtom(currentUserAtom)

    // const queryClient = useQueryClient()

    const onDrop = useCallback((acceptedFiles: any) => {
        const file = acceptedFiles[0];

        const reader = new FileReader();
        reader.onload = () => {
            const text = reader.result;
            //@ts-ignore
            Papa.parse(text, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    // console.log(results.data);
                    //@ts-ignore
                    console.log(Object.keys(results.data[0]))
                    //@ts-ignore
                    console.log(results.data[0]['Libell� complet'])
                },
                skipEmptyLines: true,
                encoding: "UTF-8"
            });
        };

        reader.readAsText(file, 'UTF-8');

    }, []);
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({ onDrop });

    const files = acceptedFiles.map((file: any) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));

    const style = useMemo(
        () => ({
            ...baseStyle,
        }),
        []
    );

    return (
        <div className="container">
            <div className="my-3 form-group">
                <section className="container my-3">
                    <div {...getRootProps({ className: 'dropzone', style })}>
                        <input {...getInputProps()} />
                        <p>Drag 'n' drop some files here, or click to select files</p>
                    </div>
                    <aside className='my-3'>
                        <h4>Files</h4>
                        <ul>{files}</ul>
                    </aside>
                </section>
            </div>
        </div>
    )
}

export default AddBulkTransaction
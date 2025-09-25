import React, { Fragment, useState, useEffect } from 'react'
import type { ChangeEvent } from 'react'
import type { MouseEvent} from 'react'
interface FileUploadProps {
    name: string
    button_title?: string
    required?: boolean
    max_file_size_in_kb?: number
    allowed_extensions?: string[]
    type?: 'image' | 'file'
    prev_src?: string
    dataChanger: (data: string) => void
}

const FileUpload: React.FC<FileUploadProps> = (props) => {
    const [fileName, setFileName] = useState<string>('')
    const [fileSize, setFileSize] = useState<string>('')
    const [fileSizeKB, setFileSizeKB] = useState<number>(0)
    const [fileType, setFileType] = useState<string>('')
    const [src, setSrc] = useState<string>('')
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        clearFileUpload()
    }, [])

    const clearFileUpload = (): void => {
        setFileName('')
        setFileSize('')
        setFileSizeKB(0)
        setFileType('')
        setSrc('')
        props.dataChanger('')
    }

    const onPickFile = (e: MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault()
        clearFileUpload()
        document.getElementById(props.name)?.click()
    }

    const onFilePicked = (e: ChangeEvent<HTMLInputElement>): void => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const file = files[0]
        const file_name = file.name
        const file_size = getFileSize(file.size)
        const file_size_kb = getFileSizeKB(file.size)
        const file_type = getFileType(file).toLowerCase()

        setFileName(file_name)
        setFileSize(file_size)
        setFileSizeKB(file_size_kb)
        setFileType(file_type)

        if (props.max_file_size_in_kb && file_size_kb > props.max_file_size_in_kb) {
            alert(`Maximum allowed file size = ${props.max_file_size_in_kb} KB`)
            clearFileUpload()
            return
        }

        if (props.allowed_extensions && !arrToLowerCase(props.allowed_extensions).includes(file_type)) {
            alert(`Allowed file types = ${props.allowed_extensions.join(', ')}`)
            clearFileUpload()
            return
        }

        const fileReader = new FileReader()
        setIsLoading(true)
        fileReader.addEventListener('load', () => {
            const result = fileReader.result as string
            props.dataChanger(result)
            setSrc(result)
            setIsLoading(false)
        })
        fileReader.readAsDataURL(file)
    }

    const getFileSize = (size: number): string => {
        return size / 1024 >= 1024
            ? `${Math.floor(size / 1024 / 1024)} MB`
            : `${Math.floor(size / 1024)} KB`
    }

    const getFileSizeKB = (size: number): number => {
        return Math.floor(size / 1024)
    }

    const getFileType = (file: File): string => {
        return file.type.split('/').pop() || ''
    }

    const arrToLowerCase = (arr: string[] = []): string[] => {
        return arr.map(str => str.toLowerCase())
    }

    const acceptTypes = props.allowed_extensions?.map(ext => '.' + ext).join(',') || ''

   
    return (
        <>
            <button 
                className="btn btn-primary text-capitalize mr-2 mb-2" 
                onClick={(e) => onPickFile(e)}
            >
                {props?.button_title || 'Upload File'}
            </button>

            {(props.required && fileName.length <= 3 && !src) && (
                <label className="label label-danger">Required</label>
            )}

            <br />

            {fileName && <label className="label label-primary">{fileName}</label>}
            {fileSize && <label className="label label-info">{fileSize}</label>}

            <br />

            {isLoading && (
                <div className="spinner-border text-primary mt-2" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            )}

            {props.type === 'image' && src && !props.prev_src && (
                <img 
                    src={src} 
                    style={{ maxHeight: '150px', maxWidth: '150px' }} 
                    alt="" 
                    className="mt-2" 
                />
            )}

            {props.type === 'image' && props.prev_src && !src && (
                <img 
                    src={props.prev_src} 
                    style={{ maxHeight: '150px', maxWidth: '150px' }} 
                    alt="" 
                    className="mt-2" 
                />
            )}

            {props.type === 'image' && src && (
                <button
                    className="btn btn-danger btn-outline-danger pl-1 pr-0 py-0 ml-2"
                    onClick={clearFileUpload}
                    title="Remove file"
                >
                    <i className="icofont icofont-ui-close"></i>
                </button>
            )}

            <input
                className="file d-none"
                type="file"
                id={props.name}
                name={props.name}
                required={props.required || false}
                onChange={onFilePicked}
                accept={acceptTypes}
            />
        </>
    )
}

export default FileUpload
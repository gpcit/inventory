import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'react-qr-code';
import html2canvas from 'html2canvas';

interface Props {
    assigned_to: string;
    department: string;
    imei: string;
    date_issued: string;
    serial_number: string;
    isModal: Boolean;
    id: any;
}

const QRCodeMobileGenerators: React.FC<Props> = ({id, assigned_to, department, imei, serial_number, isModal, date_issued }) => {
    const[isModalOpen, setIsModalOpen] = useState(isModal)
    const qrCodeValue: string = `Department: ${department}\n${imei}\nSerial Number: ${serial_number}`;
    const qrCodeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (qrCodeRef.current) {
                html2canvas(qrCodeRef.current)
                    .then((canvas) => {
                        const dataUrl = canvas.toDataURL('image/png');
                        const link = document.createElement('a');
                        link.href = dataUrl;
                        link.download = `${assigned_to}-qr_code.png`;
                        link.click();
                        
                    })
                    .catch((error) => {
                        console.error('Error generating QR code image:', error);
                    });
            } setIsModalOpen(isModal);
        }, 500); 

        return () => clearTimeout(timer);
    }, [assigned_to, isModal, date_issued]); 

    return (
        <div ref={qrCodeRef} className='text-center p-1 bg-white rounded-lg flex-row w-auto justify-center items-center' >
             <div className={`mb-3 text-sm p-1 `}><span className=''>{serial_number}</span></div>
            {/* <QRCode value={qrCodeValue} size={114} data-testid="qr-code-svg" /> */}
        </div>
    );
};

export default QRCodeMobileGenerators;
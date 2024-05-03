import React, { useEffect, useRef } from 'react';
import QRCode from 'qrcode.react';
// import QRCode from 'react-qr-code'

interface Props {
    pc_name: string;
    mac_address: string;
    specs: string;
}

const QRCodeGenerator: React.FC<Props> = ({ pc_name, mac_address, specs }) => {
    const qrCodeValue: string = `PC NAME: ${pc_name}\nMAC_ADDRESS: ${mac_address}\nSPECS: ${specs}`;
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleSaveAsImage = () => {
        if (canvasRef.current) {
            const canvas = canvasRef.current;
            const imageUrl = canvas.toDataURL('image/png');

            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `${pc_name}-qr_code.png`;
            link.click();
        }
    };

    return (
        <div className='p-4 bg-white rounded-lg shadow-md'>
            <QRCode value={qrCodeValue} data-testid="qr-code-svg" />
            <button onClick={handleSaveAsImage}>Save as Image</button>
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default QRCodeGenerator;

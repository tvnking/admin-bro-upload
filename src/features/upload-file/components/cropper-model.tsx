// @flow

/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-21
 */

import React, { FC } from 'react';
import ReactCropper from 'react-cropper';
import styled from 'styled-components'
import { Modal, Header, Text, Box, Button } from '@admin-bro/design-system'
// Types
import type Cropper from 'cropperjs';
import type { ReactCropperProps } from 'react-cropper';

// Utils
import { getFileInfo, FileObject } from '../utils/get-file-info';

// Styles
import cropperCSS from '../css/cropper';

const Container = styled.div`
${cropperCSS};
`

/**
 * CropperModel `props` type
 * @type {Object}
 */
export type CropperPropertyProps = {
	/** File or Blob object */
	file: Object,
	/** Labels */
	labels?: {
		heading: string,
		confirm: string,
		discard: string,
		zoom: string,
		rotate: string,
	},
	/** MIME type (set null for auto retrieve) */
	mime?: string,
	/** Export image quality (1~100) */
	quality?: number,
	/** Initial image zoom (0.0~10.0) */
	initialZoom?: number,
	/** Initial image rotate (-180~180) */
	initialRotate?: number,
	/** Bootstrap modal options */
	/** modalProps?: ModalProps, */
	/** Cropper options */
	cropperProps?: ReactCropperProps,
	/** Cropped canvas options */
	croppedCanvasProps?: Cropper.GetCroppedCanvasOptions,
	/** Event handlers: on confirm */
	onConfirm(croppedFile: Object): void,
	/** Event handler: on discard */
	onDiscard(file: Object): void,
	/** Event handler: Triggers on confirm and discard executed */
	onCompleted(): void,
	crop?: {
		minCropBoxWidth?: number,
		minCropBoxHeight?: number,
		initialAspectRatio?: number
	}
};

/** CropperModel functional component */
const CropperModel: FC<CropperPropertyProps> = (props) => {
	const { labels, file } = props;
	const [cropper, setCropper] = React.useState<any>(null);
	const [image, setImage] = React.useState<string | null>('');

	React.useEffect(() => {
		if (file) {

			const reader = new FileReader();
			reader.addEventListener('load', () => {
				setImage(reader.result as string);
				cropper && cropper
					.zoomTo(props.initialZoom || 0)
					.rotateTo(props.initialRotate || 0);
			});
			reader.readAsDataURL(file as (File | Blob));
		} else {
			setImage(null);
			setCropper(null);
		}
	}, [props, file, cropper]);

	/**
	 * Crop image
	 * @returns {void}
	 * @event {Props:onConfirm}
	 */
	const onConfirm = (): void => {
		if (!cropper) {
			return;
		}

		const croppedCanvas: Object = {
			minWidth: 854, maxWidth: 1200,
			minHeight: 480, maxHeight: 600,
			imageSmoothingQuality: 'medium',
			...props.croppedCanvasProps,
		};

		const canvasData: HTMLCanvasElement = cropper.getCroppedCanvas(croppedCanvas);

		const fileInfo = getFileInfo(file as FileObject, props.mime);

		canvasData.toBlob((blob) => {
			if (!blob) return typeof props.onCompleted === 'function' && props.onCompleted();
			const croppedFile = new File([blob], fileInfo.filename, { type: blob.type });
			typeof props.onConfirm === 'function' && props.onConfirm(croppedFile);
			typeof props.onCompleted === 'function' && props.onCompleted();
			setImage(null);
			setCropper(null);
		}, fileInfo.mime, props.quality);
	};

	const handleClose = (): void => {
		setCropper(false);
		setImage(null);
		typeof props.onDiscard === 'function' && props.onDiscard(file);
		typeof props.onCompleted === 'function' && props.onCompleted();
	};
	console.log(props.crop)
	return (
		<Box>
			{image && <Modal>
				<Container>
					<ReactCropper
						src={image}
						style={{ height: 500, width: '100%' }}
						viewMode={1}
						dragMode="move"
						cropBoxResizable={true}
						cropBoxMovable={false}
						center={true}
						toggleDragModeOnDblclick={false}
						checkOrientation={true}
						onInitialized={instance => setCropper(instance)}
						{...props.cropperProps}
						{...props.crop}
					/>
					<Button variant="primary" className="mr-1" onClick={onConfirm}>
						{labels?.confirm}
					</Button>
					<Button variant="secondary" onClick={handleClose}>
						{labels?.discard}
					</Button>
				</Container>
			</Modal>
			}
		</Box>
	);

}
CropperModel.defaultProps = {
	initialZoom: 0,
	initialRotate: 0,
	mime: undefined,
	quality: 70,
	labels: {
		heading: 'Crop Image',
		confirm: 'Confirm',
		discard: 'Discard',
		zoom: 'Zoom',
		rotate: 'Rotate',
	},
	// modalProps: {},
	cropperProps: {},
	croppedCanvasProps: {},
	onDiscard: () => { },
	onCompleted: () => { },
	crop: {
		minCropBoxWidth: 1,
		minCropBoxHeight: 1,
		initialAspectRatio: 1
	}
}

export default CropperModel;

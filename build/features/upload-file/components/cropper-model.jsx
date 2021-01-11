"use strict";
// @flow
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author Junaid Atari <mj.atari@gmail.com>
 * @link http://junaidatari.com Author Website
 * @since 2020-08-21
 */
const react_1 = __importDefault(require("react"));
const react_cropper_1 = __importDefault(require("react-cropper"));
const styled_components_1 = __importDefault(require("styled-components"));
const design_system_1 = require("@admin-bro/design-system");
// Utils
const get_file_info_1 = require("../utils/get-file-info");
// Styles
const cropper_1 = __importDefault(require("../css/cropper"));
const Container = styled_components_1.default.div `
${cropper_1.default};
`;
/** CropperModel functional component */
const CropperModel = (props) => {
    const { labels, file } = props;
    const [cropper, setCropper] = react_1.default.useState(null);
    const [image, setImage] = react_1.default.useState('');
    react_1.default.useEffect(() => {
        if (file) {
            const reader = new FileReader();
            reader.addEventListener('load', () => {
                setImage(reader.result);
                cropper && cropper
                    .zoomTo(props.initialZoom || 0)
                    .rotateTo(props.initialRotate || 0);
            });
            reader.readAsDataURL(file);
        }
        else {
            setImage(null);
            setCropper(null);
        }
    }, [props, file, cropper]);
    /**
     * Crop image
     * @returns {void}
     * @event {Props:onConfirm}
     */
    const onConfirm = () => {
        if (!cropper) {
            return;
        }
        const croppedCanvas = Object.assign({ minWidth: 854, maxWidth: 1200, minHeight: 480, maxHeight: 600, imageSmoothingQuality: 'medium' }, props.croppedCanvasProps);
        const canvasData = cropper.getCroppedCanvas(croppedCanvas);
        const fileInfo = get_file_info_1.getFileInfo(file, props.mime);
        canvasData.toBlob((blob) => {
            if (!blob)
                return typeof props.onCompleted === 'function' && props.onCompleted();
            const croppedFile = new File([blob], fileInfo.filename, { type: blob.type });
            typeof props.onConfirm === 'function' && props.onConfirm(croppedFile);
            typeof props.onCompleted === 'function' && props.onCompleted();
            setImage(null);
            setCropper(null);
        }, fileInfo.mime, props.quality);
    };
    const handleClose = () => {
        setCropper(false);
        setImage(null);
        typeof props.onDiscard === 'function' && props.onDiscard(file);
        typeof props.onCompleted === 'function' && props.onCompleted();
    };
    console.log(props.crop);
    return (<design_system_1.Box>
			{image && <design_system_1.Modal>
				<Container>
					<react_cropper_1.default src={image} style={{ height: 500, width: '100%' }} viewMode={1} dragMode="move" cropBoxResizable={true} cropBoxMovable={false} center={true} toggleDragModeOnDblclick={false} checkOrientation={true} onInitialized={instance => setCropper(instance)} {...props.cropperProps} {...props.crop}/>
					<design_system_1.Button variant="primary" className="mr-1" onClick={onConfirm}>
						{labels === null || labels === void 0 ? void 0 : labels.confirm}
					</design_system_1.Button>
					<design_system_1.Button variant="secondary" onClick={handleClose}>
						{labels === null || labels === void 0 ? void 0 : labels.discard}
					</design_system_1.Button>
				</Container>
			</design_system_1.Modal>}
		</design_system_1.Box>);
};
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
};
exports.default = CropperModel;

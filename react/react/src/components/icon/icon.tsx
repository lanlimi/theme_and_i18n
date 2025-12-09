// 可变色icon图标，但只能显示单种颜色
const Icon = (props: any) => {
    const {style={}, type, className, ...ret} = props
    return (
        <i style={style}  className={`iconFont ${type} ${className}`} {...ret}></i>
    )
}
export default Icon

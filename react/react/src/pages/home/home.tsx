import useStyles from "./style/index";

const HomePage = () => {
    const { styles } = useStyles();

    return (
        <div className={styles.root}>
            <h1>主页</h1>
        </div>
    )
}

export default HomePage
import Axios from "axios";

export const getPosts = (limit, currentPage = 1) => {
    this.setState({ loading: true })
    Axios.get(`http://otp.demis.ru/app/web/srceenshotter/find-pages?page=${currentPage}&limit=${limit}&term=${this.state.searchQuery}`)
        .then(res => {
            console.log(res.data);
            this.setState({
                pagination: {
                    ...this.state.pagination,
                    total: res.data.total
                },
                pages: res.data.pages,
                loadData: true,
                loading: false
            });
        })
        .catch(error => {
            console.log(`Ошибка API: ${error}`);
        })
}
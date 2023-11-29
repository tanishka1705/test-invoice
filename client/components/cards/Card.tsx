import ButtonLoading from '../spinners/buttonLoading'

const Card = ({ color, title, total, isLoading }: { color: string, title: string, total: number, isLoading: boolean }) => {
    return (
        <div className={`${color} card px-3 py-4 shadow-xl rounded-md flex items-center md:flex-col md:w-[85%] sm:w-[50%] sm:mx-auto xs:justify-between`}>
            <h1 className='text-lg font-semibold tracking-wider text-slate-50'>{title}</h1>
            <div>
              {isLoading ? <ButtonLoading /> : <p className='text-[2rem] text-center font-semibold text-slate-50'>{total}</p>}
            </div>
        </div>
    )
}

export default Card
from dash import Dash, html, dcc
from dash.dependencies import Input, Output
from datetime import datetime
import plotly.express as px
from pathlib import Path
import pandas as pd


def create_dash(flask_app):    
    dash_app = Dash(__name__, eager_loading=True, server=flask_app, url_base_pathname='/dashboard/')
    filepath = 'contact_details.csv'
    if Path(filepath).stat().st_size == 0:
        print("if")
        dash_app.layout = html.Div([html.H1("Contact Records Dashboard",
                                            style={"textAlign": "center", "color": "#0a0a0a",
                                                "font-size": 40}
                                            ),
                                            html.P("No contact information available",
                                            style={"textAlign": "center", "color": "#0a0a0a",
                                                "font-size": 20}),
                                    ])
    else:
        print("else")
        contact_df = pd.read_csv(filepath)
        max_year = contact_df["year"].max()
        min_year = contact_df["year"].min()
        year = datetime.now().year
        marks = {tic: str(tic) for tic in range(year-100, year + 1, 10)}

        dash_app.layout = html.Div([html.H1("Contact Records Dashboard",
                                            style={"textAlign": "center", "color": "#0a0a0a",
                                                "font-size": 40}),
                                            dcc.Dropdown(id="contact-dropdown",
                                                        options=[
                                                            {"label": "Source", "value": "source"},
                                                            {"label": "Gender", "value": "gender"},
                                                            {"label": "Zodiac Sign", "value": "zodiac_sign"}
                                                        ],
                                                        placeholder="Select",
                                                        searchable=True
                                            ),
                                            html.Br(),

                                            # Charts for source, gender, zodiac sign
                                            html.Div(dcc.Graph(id="dynamic-chart")),
                                            html.Br(),

                                            html.P("Birth Year Range:"),
                                            dcc.RangeSlider(id="year-slider",
                                                            min=year-100,
                                                            max=year,
                                                            step=10,
                                                            value=[min_year, max_year],
                                                            marks=marks
                                            ),
                                            html.Div(dcc.Graph(id="year-line-chart")),
                                            ])

        # callback function for dropdown and range slider
        @dash_app.callback(
            Output("year-line-chart", "figure"),
            Input("year-slider", "value")
        )
        def update_year_line_chart(selected_range):
            filtered_df = contact_df[(contact_df['year'] >= selected_range[0]) & (contact_df['year'] <= selected_range[1])].copy()
            
            start_decade = (selected_range[0] // 10) * 10
            end_decade = (selected_range[1] // 10) * 10
            
            decade_intervals = list(range(start_decade, end_decade + 10, 10))
            filtered_df.loc[:,'decade_interval'] = filtered_df['year'].apply(lambda x: (x // 10) * 10)
            interval_counts = filtered_df['decade_interval'].value_counts().reindex(decade_intervals, fill_value=0).sort_index()
            labels = [f"{i}-{i + 9}" for i in interval_counts.index]

            plot_data = pd.DataFrame({
                'Decade Interval': labels,
                'Count': interval_counts.values
            })
            
            fig = px.line(plot_data, x='Decade Interval', y='Count', title='Record Count by Year', markers=True)
            
            return fig


        @dash_app.callback(
            Output("dynamic-chart", "figure"),
            [Input(component_id="contact-dropdown", component_property="value"),
            Input(component_id="year-slider", component_property="value")]
        )
        def update_dynamic_chart(selected_value, selected_range):
            filtered_df = contact_df[(contact_df['year'] >= selected_range[0]) & (contact_df['year'] <= selected_range[1])].copy()
            if not selected_value:
                return []
            elif selected_value == "source":
                # Bar chart for source distribution
                source_counts = filtered_df['source'].value_counts().reset_index()
                source_counts.columns = ['Source', 'Count']
                
                fig = px.bar(source_counts, x='Source', y='Count', title='Source Distribution')
                return fig
            
            elif selected_value == "gender":
                # Pie chart for gender distribution
                gender_counts = filtered_df['gender'].value_counts().reset_index()
                gender_counts.columns = ['Gender', 'Count']
                
                fig = px.pie(gender_counts, names='Gender', values='Count', title='Gender Distribution')
                return fig
            
            elif selected_value == "zodiac_sign":
                # Box plot for zodiac sign distribution
                zodiac_counts = filtered_df['zodiac_sign'].value_counts().reset_index()
                zodiac_counts.columns = ['Zodiac Sign', 'Count']
                
                fig = px.bar(zodiac_counts,
                            x='Zodiac Sign', y='Count', 
                            title='Zodiac Sign Distribution',
                            color='Zodiac Sign')
                return fig

        
    return dash_app
